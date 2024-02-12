// noinspection JSCheckFunctionSignatures,JSUnresolvedReference

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
global.ConductCollection = ConductCollection;
global.Haul = Haul;
global.ReserveController = ReserveController;
global.ClaimController = ClaimController;
global.extendCreepLifespan = extendCreepLifespan;

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
const REINFORCE_LEVEL = 30000;
const RAMPART = [
    new RoomPosition(11, 19, Game.rooms['W59S4'].name),
    new RoomPosition(23, 13, Game.rooms['W59S4'].name),
    // new RoomPosition(11, 42, Game.rooms['W59S4'].name),
    // new RoomPosition(6, 35, Game.rooms['W59S4'].name),
    // new RoomPosition(12, 20, Game.rooms['W59S4'].name),
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

/**
 * Get creeps by role, providing the room name for inter-room functionality
 * @param role
 * @param roomName
 * @returns {*}
 */
function getCreepsByRole(role, roomName) {
    return Game.rooms[roomName].find(FIND_MY_CREEPS, {
        filter: creep => creep.memory.role === role
    });
}

/**
 * Balanced and Optimized function to Mine from Energy Source
 * Mineral sources with Extractor if resource is available can be harvested too.
 * @param creep
 */
function Mine(creep) {
    try {
        // Check if the creep already has a source assigned. If not - Assign one
        if (!creep.memory.sourceId) {
            let sources = Object.values(Memory.rooms[creep.room.name].sourceIDs)
            // Find the least assigned source in the room with no Creep on it and Assign the least assigned source to the creep
            creep.memory.sourceId = _.min(sources, sourceId => {
                return _.filter(Game.creeps, c => c.memory.role === 'harvester' && c.memory.sourceId === sourceId).length;
            });
        }

        // Get the assigned source based on the creep.memory and move the creep to it.
        let source = Game.getObjectById(creep.memory.sourceId);
        let harvest = creep.harvest(source);
        if (harvest === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, MINE_PATH);
        }
    } catch (error) {
        console.log(`Error while mining: ${error}`);
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
    for (let structure of defences) {
        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, REINFORCE_PATH);
        }
    }
}

/**
 * Commences repair based on Room.memory.damagedStructures list. Upon depletion of the list it is automatically renews from main.js
 * @param creep
 * @param roomName
 */
function Repair(creep, roomName) {
    //Get repair Creeps and the structure IDs from room memory
    let structuresID = Memory.rooms[roomName].damagedStructures;

    if (creep.memory.repairID === '') {
        if (structuresID[0]) {
            creep.memory.repairID = structuresID[0];
            Memory.rooms[roomName].damagedStructures = _.without(Memory.rooms[roomName].damagedStructures, structuresID[0]);
        }
    } else {
        let structure = Game.getObjectById(creep.memory.repairID)
        if (structure) {
            let repair = creep.repair(structure)
            if (repair === ERR_NOT_IN_RANGE) {
                creep.moveTo(structure, REPAIR_PATH);
            }
            // If Repaired, Remove the structure from the list
            if (structure.hits === structure.hitsMax) {
                creep.memory.repairID = '';
            }
        } else {
            creep.memory.repairID = '';
        }
    }
}

/**
 * Build Function - finds any sites and moves the creep there and performs the build operation.
 * Inter-Room now available
 * @param creep
 * @param roomName
 */
function Build(creep, roomName) {
    //Get builder Creeps and the construction site IDs from room memory
    let siteIDs = Memory.rooms[roomName].constructionSites;

    if (!creep.memory.siteID || creep.memory.siteID === '') {
        if (siteIDs[0]) {
            creep.memory.siteID = siteIDs[0];
            Memory.rooms[roomName].constructionSites = _.without(Memory.rooms[roomName].constructionSites, siteIDs[0]);
        }
    } else {
        let site = Game.getObjectById(creep.memory.siteID);
        if (site) {
            let build = creep.build(site)
            if (build === ERR_NOT_IN_RANGE) {
                creep.moveTo(site, BUILD_PATH);
            }
        } else{
            creep.memory.siteID='';
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
    let rangers = Object.values(Game.creeps).filter(creep => creep.memory.role === 'ranger');
    for (let d = 0; d < defenders.length; d++) {
        if (defenders[d].pos !== RAMPART[d] && defenders[d].memory.role === 'defender') {
            defenders[d].moveTo(RAMPART[d], DEFENCE_PATH)
            // Find hostile creeps in Melee range
            let hostileCreepsInMelee = defenders[d].pos.findInRange(FIND_HOSTILE_CREEPS, 1); // Adjust the range as needed
            if (hostiles.length > 0 && defenders[d].memory.role === 'defender') {
                // Attack the closest hostile creep
                let targetCreep = defenders[d].pos.findClosestByRange(hostileCreepsInMelee);
                defenders[d].attack(targetCreep);
            }
        }
        if (rangers[d].pos !== RAMPART[d]) {
            rangers[d].moveTo(new RoomPosition(RAMPART[d].x + 1, RAMPART[d].y + 1, Game.rooms['W59S4'].name), DEFENCE_PATH)
            // Find hostile creeps in Ranged range
            let hostileCreepsInRange = rangers[d].pos.findInRange(FIND_HOSTILE_CREEPS, 3); // Adjust the range as needed
            if (hostiles.length > 0 && rangers[d].memory.role === 'ranger') {
                // Range Attack the closest hostile creep
                let targetCreep = rangers[d].pos.findClosestByRange(hostileCreepsInRange);
                rangers[d].rangedAttack(targetCreep);
            }
        }
    }
}

/**
 * Raids Tombstones in the room and takes all their belongings
 * @param creep
 */
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

/**
 * Conducts Collection of dropped resources
 * @param creep
 */
function ConductCollection(creep) {
    // Find all dropped resources in the room
    const droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);

    // Filter out undefined or null resources
    const validDroppedResources = droppedResources.filter(resource => resource);

    if (validDroppedResources.length > 0) {
        // Choose the closest dropped resource and move towards it
        const closestResource = creep.pos.findClosestByRange(validDroppedResources);
        if (creep.pickup(closestResource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(closestResource, TOMBRAIDING_PATH);
        }
    } else {
        // Handle the case when there are no  dropped valid resources
        creep.say('🔄 Idle');
        creep.moveTo(new RoomPosition(14, 36, ROOM.name));
    }
}

/**
 * Conducts Hauling of energy in case Link is not available
 * @param creep
 */
function Haul(creep) {
    let sources = [
        Game.getObjectById(ZYNTHIUM_CONTAINER),
    ];
    if (sources[0].store.getUsedCapacity() > 1000) {
        WithdrawAlloys(creep, sources[0]);
        WithdrawEnergy(creep, sources[0]);
    }
}

/**
 * Function to reserve the controller. Required if Neutral
 * @param creep
 */
function ReserveController(creep) {
    let controller = creep.room.controller;

    if (controller) {
        if (creep.pos.inRangeTo(controller, 1)) {
            // Reserve the controller
            let reserveResult = creep.reserveController(controller);
            console.log('Reserve Result:', reserveResult);
            return reserveResult;
        } else {
            // Move closer to the controller
            let moveResult = creep.moveTo(controller, {visualizePathStyle: {stroke: '#650a65'}});
            console.log('Move Result:', moveResult);
        }
    } else {
        // Handle the case when the controller is not present (optional)
        console.log("No controller found in the room.");
    }
}

/**
 * Function to Claim the controller.
 * @param creep
 */
function ClaimController(creep) {
    let controller = creep.room.controller;

    if (controller) {
        if (creep.pos.inRangeTo(controller, 1)) {
            // Claim the controller
            console.log("Claiming Controller: In Progress...")
            let result = creep.claimController(controller);
            console.log("Claiming Controller Result: " + result);
        } else {
            // Move closer to the controller
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#650a65'}});
        }
    } else {
        // Handle the case when the controller is not present (optional)
        console.log("No controller found in the room.");
    }
}



//incomplete
function extendCreepLifespan(creep) {
    // Check if the creep needs healing
    if (creep.hits < creep.hitsMax) {
        // Find all healers within range
        let healers = creep.pos.findInRange(FIND_MY_CREEPS, 3, {
            filter: c => c.getActiveBodyparts(HEAL) > 0
        });

        // Sort the healers by distance to the creep
        healers.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));

        // If there are healers nearby, heal the creep
        if (healers.length > 0) {
            let healer = healers[0];
            let healResult = healer.renewCreep(creep);
            if (healResult === ERR_NOT_IN_RANGE) {
                // Move the healer towards the creep if not in range
                healer.moveTo(creep, { visualizePathStyle: { stroke: '#ffaa00' } });
            } else if (healResult === OK) {
                // Successful healing
                console.log(`Healer ${healer.name} extended the lifespan of ${creep.name}`);
            }
        } else {
            // No healers nearby to extend the creep's lifespan
            console.log(`No healers found nearby to extend the lifespan of ${creep.name}`);
        }
    }
}