const _ = require('lodash');
let roleHarvester = require('role.Harvester');
let roleUpgrader = require('role.Upgrader');
let roleBuilder = require('role.Builder');
let roleHauler = require('role.Hauler');
let roleRepairer = require('role.Repairer');
let roleCollector = require('role.Collector');
let roleSupplier = require('role.Supplier');
let roleClaimer = require('role.Claimer');
let roleDefender = require('role.Defender');
let roleTombraider = require('role.Tombraider');
let roleRanger = require('role.Ranger');
let roleCarrier = require('role.Carrier');
let roleManager = require('role.Manager');

global.ROOM = Game.rooms['W59S4'];
global.ZYNTHIUM_CONTAINER = '65c8065fadd2617162d9f072';

const roomData = {
    'W59S4': {
        'spawner': 'Xel\'Invictus',
        'creepCounts': {
            'harvester': Memory.rooms['W59S4'].sourceIDs.length,
            'upgrader': Math.max(1, Game.rooms['W59S4'].storage.store[RESOURCE_ENERGY] / 100000),
            'builder': 1,
            'hauler': 2,
            'collector': 1,
            'tombraider': 1,
            // 'defender': 1,
            // 'ranger': 1,
            // 'claimer': 1,
            'supplier': 1,
            'manager': 1,
            // 'carrier':1,
            // Add more roles and counts as needed for the Room
        }
    },
    'W59S5': {
        'spawner': `Xel'Hydrogenius`,
        'creepCounts': {
            'harvester': 1,
            'repairer': Math.max(1, Memory.rooms['W59S5'].damagedStructures.length / 20),
            'upgrader': 2,
            'hauler': 2,
            'collector': 1,
            // 'builder': 1,
            // 'carrier': 1,
            'tombraider': 1,
            // Add more roles and counts as needed for the Room
        }
    }
    // Add more rooms as needed
};

const BodyPartsRenderer = {
    'minor-harvester': [WORK, WORK, CARRY, MOVE],
    'lesser-harvester': [WORK, WORK, WORK, CARRY, MOVE],
    'greater-harvester': [WORK, WORK, WORK, WORK, CARRY, MOVE],
    'harvester': [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],

    'minor-repairer': [WORK, CARRY, MOVE, MOVE],
    'lesser-repairer': [WORK, CARRY, CARRY, MOVE, MOVE],
    'greater-repairer': [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    'repairer': [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],

    'minor-upgrader': [WORK, CARRY, MOVE, MOVE],
    'lesser-upgrader': [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    'greater-upgrader': [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    'upgrader': [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],

    'minor-builder': [WORK, CARRY, MOVE, MOVE],
    'lesser-builder': [WORK, WORK, CARRY, MOVE, MOVE],
    'greater-builder': [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    'builder': [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],

    'minor-collector': [CARRY, CARRY, MOVE, MOVE],
    'lesser-collector': [CARRY, CARRY, MOVE, MOVE],
    'greater-collector': [CARRY, CARRY, MOVE, MOVE],
    'collector': [CARRY, CARRY, MOVE, MOVE],


    'minor-hauler': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    'lesser-hauler': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    'greater-hauler': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    'hauler': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],

    'manager': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],

    'minor-tombraider': [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    'lesser-tombraider': [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    'tombraider': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],

    'carrier': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    'defender': [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK],
    'ranger': [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK],
    'supplier': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    'claimer': [CLAIM, MOVE, MOVE],
}

/**
 * Entry point to All Scripts
 */
module.exports.loop = function () {
    //Creeps and Roles Initializer
    for (let roomName in roomData) {
        BuildCreepsForRoom(roomName);
    }
    CreepDrivers()
}

/**
 * Universal Creep Builder
 * @param role
 * @param bodyParts
 * @param roleName
 * @param creepCounter
 * @param spawner
 */
function BuildCreep(role, bodyParts, roleName, creepCounter, spawner) {
    let room = Game.spawns[spawner].room; // Get the room where the spawner is located
    let creepsOfType = room.find(FIND_MY_CREEPS, {
        filter: (creep) => creep.memory.role === role
    });
    if (creepsOfType && creepsOfType.length < creepCounter) {
        let newName = roleName + Game.time;
        console.log(`Spawning new ${roleName} in ${spawner}: ${newName}`);
        Game.spawns[spawner].spawnCreep(bodyParts, newName, {memory: {role: role}});
    }
}

/**
 * Room-Based Initializer of BuildCreep
 * @param roomName
 */
function BuildCreepsForRoom(roomName) {
    const room = roomData[roomName];
    const spawner = room.spawner;

    for (let role in room.creepCounts) {
        const roleByController = getCreepBodyParts(role, Game.rooms[roomName].controller.level);
        const bodyParts = BodyPartsRenderer[roleByController];
        const creepCounter = room.creepCounts[role];
        BuildCreep(role, bodyParts, role.charAt(0).toUpperCase() + role.slice(1), creepCounter, spawner);
    }

    //Say what you build, Spawner
    if (Game.spawns[spawner].spawning) {
        let spawningCreep = Game.creeps[Game.spawns[spawner].spawning.name];
        Game.spawns[spawner].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[spawner].pos.x + 1,
            Game.spawns[spawner].pos.y,
            {align: 'left', opacity: 0.8});
    }
}

function getCreepBodyParts(role, controllerLevel) {
    // Retrieve body parts based on role and controller level
    switch (controllerLevel) {
        case 1:
            return role = "minor" + '-' + role;
        case 2:
            return role = "lesser" + '-' + role;
        // case 4:
        //     return role = "greater" + '-' + role;
        default:
            return role;
    }
}

/**
 * Initializes the roles of each creep post creation
 */
function CreepDrivers() {
    //Clean Memory from Dead Creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //Define Memory Data
    getDamagedStructures();
    getConstructionSites();
    getSources();
    getLinkTransfer();
    Tower();
    Factory();


    // Define a mapping of roles to role functions
    const roleFunctions = {
        'harvester': roleHarvester,
        'upgrader': roleUpgrader,
        'builder': roleBuilder,
        'hauler': roleHauler,
        'repairer': roleRepairer,
        'collector': roleCollector,
        'supplier': roleSupplier,
        'claimer': roleClaimer,
        'defender': roleDefender,
        'tombraider': roleTombraider,
        'ranger': roleRanger,
        'carrier': roleCarrier,
        'manager': roleManager,
    };

    // Initialize the Role of each Creep
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        let roleFunction = roleFunctions[creep.memory.role];
        if (roleFunction) {
            roleFunction.run(creep);
        }
    }
}

/**
 * Check Room memory for Damaged structures. If non, find all, order them by hit points lost and set in memory.
 */
function getDamagedStructures() {
    for (let roomName in Game.rooms) {
        if (!Memory.rooms[roomName].damagedStructures || Memory.rooms[roomName].damagedStructures.length <= 0) {
            let room = Game.rooms[roomName];
            let damagedStructures = room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.hits < structure.hitsMax
                        && structure.hits < 250000
                        && structure.structureType !== STRUCTURE_WALL
                        && structure.structureType !== STRUCTURE_RAMPART;
                }
            });

            // Order the damaged structures by their hits difference
            // damagedStructures.sort((a, b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits));

            // Store the list of damaged structure IDs in Memory
            Memory.rooms[roomName].damagedStructures = _.map(damagedStructures, 'id');
        }
        console.log(`Structures to Repair [${roomName}]: ${Memory.rooms[roomName].damagedStructures.length}`)
    }
}

/**
 * Finds and puts in memory all Construction sites in the rooms I own.
 */
function getConstructionSites() {
    for (let roomName in Game.rooms) {
        if (!Memory.rooms[roomName].constructionSites || Memory.rooms[roomName].constructionSites.length === 0) {
            let room = Game.rooms[roomName];
            let sites = room.find(FIND_CONSTRUCTION_SITES);
            if (sites) {
                Memory.rooms[roomName].constructionSites = sites.map(site => site.id);
            }
        }
        console.log(`Construction Sites for Room ${roomName}: ${Memory.rooms[roomName].constructionSites.length}`)
    }
}

/**
 * Gathers all Source IDs, including Mineral Deposits that have Extractor constructed and are not Regenerating.
 */
function getSources() {
    for (let roomName in Game.rooms) {
        //Get the Room Object from the name.
        let room = Game.rooms[roomName];

        //Through the Room Object find the sources needed.
        let sources = room.find(FIND_SOURCES);
        let mineral = room.find(FIND_MINERALS, {
            filter: mineral => {
                let extractor = mineral.pos.lookFor(LOOK_STRUCTURES).find(structure => structure.structureType === STRUCTURE_EXTRACTOR);
                return extractor && mineral.ticksToRegeneration === undefined; // Exclude respawning minerals
            }
        })[0];

        // Concatenate sources and mineral into one array
        let allSources = [...sources, mineral].filter(Boolean); // Filter out any undefined values

        // Map the IDs of all sources to Memory and print to Console
        Memory.rooms[roomName].sourceIDs = allSources.map(source => source.id);
        console.log(`Sources Count [${roomName}]: ${Memory.rooms[roomName].sourceIDs.length}`)
    }
}

/**
 * Automatically transfers the Energy within the Link to the Receiving Link at the Storage.
 * It is based on defined room in the RoomData Object as the Owned Room may have neither Link nor Storage.
 */
function getLinkTransfer() {
    for (let roomName in roomData) {
        let room = Game.rooms[roomName];
        if (room.controller.level >= 6) {
            let links = room.find(FIND_MY_STRUCTURES, {
                filter: structure => structure.structureType === STRUCTURE_LINK
            });

            // Find the closest link to storage
            let closestLinkToStorage = room.storage.pos.findClosestByRange(links);
            links = _.without(links, closestLinkToStorage);
            for (let link of links) {
                if (closestLinkToStorage.energy === 0 && link.energy >= 800) {
                    room.visual.line(link.pos.x, link.pos.y, closestLinkToStorage.pos.x, closestLinkToStorage.pos.y, {
                        color: 'white',
                        lineStyle: 'dashed'
                    });
                    link.transferEnergy(closestLinkToStorage);
                }
            }
        }
    }
}

function Factory() {
    let factory = Game.getObjectById('65d71e80e4219d254f628572')

    // Check if the factory is not on cooldown
    if (factory.cooldown > 0) {
        // console.log("Factory is on cooldown. Cannot transform Zynthium to bars.");
        return;
    }

    // Check if the factory has enough resources and space to perform the transformation
    if (factory.store.getUsedCapacity(RESOURCE_ZYNTHIUM) < 100 || factory.store.getFreeCapacity() < 100) {
        // console.log("Insufficient resources or space in the factory.");
        return;
    }

    // Perform the transformation
    let result = factory.produce(RESOURCE_ZYNTHIUM_BAR);

    if (result === OK) {
        // console.log("Transformation of Zynthium to Zynthium bars successful.");
    } else {
        // console.log("Error: Unable to transform Zynthium to Zynthium bars. Error code:", result);
    }
}

function Tower() {
    let roomName = 'W59S4';
    // Retrieve the room where the tower is located
    let room = Game.rooms[roomName];

    // Find the tower in the room
    let tower = room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    });

    // Find the enemy creep in the room
    let enemy = room.find(FIND_HOSTILE_CREEPS);
    if (tower.length > 0) {

        // Check if tower and enemy exist
        if (enemy && enemy.length > 0) {
            tower[0].attack(enemy[0]);
        }

        // Conduct Repairs
        else if (Memory.rooms[roomName].damagedStructures.length > 0) {
            for (let structureId of Memory.rooms[roomName].damagedStructures) {
                let structure = Game.getObjectById(structureId);
                if (structure) {
                    tower[0].repair(structure);
                    if (structure.hits === structure.hitsMax) {
                        Memory.rooms[roomName].damagedStructures = _.without(Memory.rooms[roomName].damagedStructures, structure.id);
                    } else {
                        break;
                    }
                }
            }
        } else {
            Reinforce(tower[0])
        }
    }
}

/**
 * Get Count of all creepers through the Console
 */
global.GroupCreepsByRole = function () {
    // Initialize an object to store the count of creeps for each role
    let creepCountByRole = {};

    // Iterate over all creeps in the game
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];

        // Check if the creep has a role property
        if (creep.memory.role) {
            // Increment the count for the respective role
            creepCountByRole[creep.memory.role] = (creepCountByRole[creep.memory.role] || 0) + 1;
        }
    }

    // Print the count for each role
    for (let role in creepCountByRole) {
        console.log(`${role}: ${creepCountByRole[role]}`);
    }
}