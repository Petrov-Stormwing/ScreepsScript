const _ = require("lodash");

//Global Functions and Constants
global.getSpawner = getSpawner;
global.getContainers = getContainers;
global.getTombstones = getTombstones;
global.getExtensions = getExtensions;
global.getNearestContainer = getNearestContainer;
global.getNearestExtension = getNearestExtension;
global.getCreepsByRole = getCreepsByRole;
global.Mine = Mine;
global.Salvage = Salvage;
global.Reinforce = Reinforce;
global.Repair = Repair;
global.Build = Build;
global.Upgrade = Upgrade;
global.Attack = Attack;
global.Defend = Defend;
global.Tombraiding = Tombraiding;

//Constants for PathStyle
const MINE_PATH = {visualizePathStyle: {stroke: '#ff0000'}};
const DEFENCE_PATH = {visualizePathStyle: {stroke: '#ff0000'}};
const REINFORCE_PATH = {visualizePathStyle: {stroke: '#f9fd00'}};
const REPAIR_PATH = {visualizePathStyle: {stroke: '#0b4b00'}};
const SALVAGE_PATH = {visualizePathStyle: {stroke: '#00f0fb'}};
const UPGRADE_PATH = {visualizePathStyle: {stroke: '#0005a7'}};
const BUILD_PATH = {visualizePathStyle: {stroke: '#53035c'}};
const TOMBRAIDING_PATH = {visualizePathStyle: {stroke: '#000000'}};

//Constants for this File
const REINFORCE_LEVEL = 25000;
const RAMPART = [
    new RoomPosition(11, 19, Game.rooms['W59S4'].name),
    new RoomPosition(20, 46, Game.rooms['W59S4'].name),
    new RoomPosition(11, 42, Game.rooms['W59S4'].name),
    new RoomPosition(6, 35, Game.rooms['W59S4'].name),
];

function getSpawner(creep) {
    return creep.room.find(FIND_MY_SPAWNS)[0];
}

// Find all containers in the room
function getContainers(creep) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_CONTAINER
    });
}

// Find all extensions in the room
function getExtensions(creep) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
            && structure.store[RESOURCE_ENERGY] < EXTENSION_ENERGY_CAPACITY[creep.room.controller.level]
    });
}

// Find all Tombstones in the room
function getTombstones(creep) {
    let tombstones = creep.room.find(FIND_TOMBSTONES, {
        filter: tombstone => tombstone.store && Object.keys(tombstone.store).length > 0
    });
    console.log("Number of Tombstones: " + tombstones.length);
    return tombstones;
}

// Find nearest single container in the room
function getNearestContainer(creep) {
    let containers = getContainers(creep);
    if (containers.length > 0) {
        return creep.pos.findClosestByPath(containers);
    } else {
        console.log("No Containers in this Room")
    }
}

// Find nearest single extension in the room
function getNearestExtension(creep) {
    let extensions = getExtensions(creep)
    if (extensions.length > 0) {
        return creep.pos.findClosestByPath(extensions);
    } else {
        //console.log(`No Empty Extensions in Room: ${creep.room.name}`)
    }
}

// Find nearest single extension in the room
function getNearestTombstone(creep) {
    let extensions = getTombstones(creep)
    if (extensions.length > 0) {
        return creep.pos.findClosestByPath(extensions);
    } else {
        //console.log(`No Empty Extensions in Room: ${creep.room.name}`)
    }
}

//Get creeps by role without repeating the code for that in various occasions.
function getCreepsByRole(creep, role) {
    return Object.values(Game.creeps).filter(
        creep => creep.memory.role === role);
}

/**
 * Balanced and Optimized function to Mine from Energy Source
 * @param creep
 */
function Mine(creep) {
    // Check if the creep already has a source assigned
    if (!creep.memory.sourceId) {
        // If not, find the sources in the room
        let sources = creep.room.find(FIND_SOURCES);

        // Find the least assigned source among all creeps
        let leastAssignedSource = _.min(sources, source => _.filter(Game.creeps, c => c.memory.sourceId === source.id).length);

        // Assign the least assigned source to the creep
        creep.memory.sourceId = leastAssignedSource.id;
    }

    // Get the assigned source based on the memory
    let source = Game.getObjectById(creep.memory.sourceId);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, MINE_PATH);
    }
}

/**
 * Used for the purpose of draining energy from Ruins if present in the room.
 * @param creep
 */
function Salvage(creep) {
    //Find Ruins
    let ruins = Game.rooms['W59S4'].find(FIND_RUINS);

    //If Ruins in the room Exist, WithdrawEnergy existing Energy from them
    if (ruins.length > 0) {
        for (let ruin of ruins) {
            if (ruin.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(ruin, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(ruin, SALVAGE_PATH);
                }
                break;
            }
        }
    } else {
        console.log("No Ruins present in the room at the moment");
    }
}

/**
 * Reinforces Walls and Ramparts to hit points limited by the REINFORCE_LEVEL constant.
 * @param creep
 */
function Reinforce(creep) {
    let defences = ROOM.find(FIND_STRUCTURES, {
        filter: structure => {
            return (structure.structureType === STRUCTURE_WALL
                    || structure.structureType === STRUCTURE_RAMPART)
                && structure.hits < REINFORCE_LEVEL
        }
    });
    let builders = getCreepsByRole(creep, 'builders')
    for (let structure of defences) {
        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, REINFORCE_PATH);
        }
    }
}

/**
 * Commences repair based on Room.memory.damagedStructures list. Upon depletion of the list it is automatically renews from main.js
 * @param creep
 */
function Repair(creep) {
    //Get repair Creeps and the structure IDs from room memory
    let repairers = getCreepsByRole(creep, 'repairer')
    let structuresID = ROOM.memory.damagedStructures;
    console.log(`Structures to Repair: ${ROOM.memory.damagedStructures.length}`)

    //If there are creeps available, cycle through the IDs and give each repairer an object to repair.
    if (repairers.length > 0) {
        for (let r = 0; r < _.min([repairers.length, structuresID.length]); r++) {
            let structure = Game.getObjectById(structuresID[r]);

            //Either Repair or Remove from Memory
            if (structure) {
                // Room.memory.CurrentlyReparing++;
                if (repairers[r].repair(structure) === ERR_NOT_IN_RANGE)
                    repairers[r].moveTo(structure, REPAIR_PATH);
            } else {
                console.log(structure);
                console.log(structuresID[r]);
                ROOM.memory.damagedStructures = _.without(ROOM.memory.damagedStructures, structuresID[r]);
            }

            // If Repaired, Remove the structure from the list
            if (structure.hits === structure.hitsMax) {
                ROOM.memory.damagedStructures = _.without(ROOM.memory.damagedStructures, structure.id);
                // Room.memory.CurrentlyReparing--;
            }
        }
    } else {
        console.log("No CREEPS found to conduct Repairs");
    }
}

/**
 * Build Function - finds any sites and moves the creep there and performs the build operation.
 * @param creep
 * @param targets
 */
function Build(creep, targets) {
    if (targets.length > 0) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], BUILD_PATH);
        }
    }
}

/**
 * Upgrade Function
 * @param creep
 * */
function Upgrade(creep) {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, UPGRADE_PATH);
    }
}

function Attack(creep, hostiles) {
    console.log(`Hostiles: ${hostiles.length}`)
    // Attack the nearest hostile creep
    if (creep.attack(hostiles[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(hostiles[0], {visualizePathStyle: {stroke: '#ff0000'}});
    }
}

function Defend(creep, hostiles) {
    let defenders = Object.values(Game.creeps).filter(creep => creep.memory.role === 'defender');
    for (let d = 0; d < defenders.length; d++) {
        if (defenders[d].pos !== RAMPART[d]) {
            defenders[d].moveTo(RAMPART[d], DEFENCE_PATH)

            // Find hostile creeps in range
            let hostileCreepsInRange = defenders[d].pos.findInRange(FIND_HOSTILE_CREEPS, 3); // Adjust the range as needed

            if (hostileCreepsInRange.length > 0) {
                // Attack the closest hostile creep
                let targetCreep = defenders[d].pos.findClosestByRange(hostileCreepsInRange);
                defenders[d].attack(targetCreep);
            }
        }
    }
}

function Tombraiding(creep) {
    // Find tombstones with resources
    let tombstones = getTombstones(creep)

    if (tombstones.length > 0) {
        console.log("Number of Tombstones: " + tombstones.length)

        // Harvest from the nearest tombstone
        if (creep.withdraw(tombstones[0], Object.keys(tombstones[0].store)[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(tombstones[0], TOMBRAIDING_PATH);
        }
    } else {
        creep.say('🔄 Idle');
        creep.moveTo(new RoomPosition(16, 36, ROOM.name))
    }
}