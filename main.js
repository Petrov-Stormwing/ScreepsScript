const _ = require('lodash');
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleHauler = require('role.hauler');
let roleRepairer = require('role.Repairer');
let roleCollector = require('role.Collector');
let roleSupplier = require('role.Supplier');
let roleClaimer = require('role.Claimer');
let roleDefender = require('role.Defender');
let roleTombraider = require('role.Tombraider');
let roleRanger = require('role.Ranger');

global.ROOM = Game.rooms['W59S4'];
global.NORTH_ENERGY_CONTAINER = '65b7e25609c2d1cf9e20b559';
global.SOUTH_ENERGY_CONTAINER = '65b7e57973f23d398567fbc3';
global.ZYNTHIUM_CONTAINER = '65c004cdfc811b3e490a8a12';
global.CONTROLLER_ENERGY_CONTAINER_I = '65b7fc77ba73c30e2e6a9e67';
global.CONTROLLER_ENERGY_CONTAINER_II = '65b8f767d93405714cd188e2';

const roomData = {
    'W59S4': {
        'spawner': 'Xel\'Invictus',
        'creepCounts': {
            'harvester': 2,
            'builder': 2,
            'upgrader': 2,
            'repairer': 3,
            'hauler': 4,
            'collector': 1,
            'tombraider': 1,
            'defender': 1,
            'ranger': 1,
            'claimer': 0,
            'supplier': 0,
            // Add more roles and counts as needed for Room1
        }
    },
    // 'Room2': {
    //     'spawner': 'Spawn2',
    //     'creepCounts': {
    //         'harvester': 4,
    //         'upgrader': 2,
    //         // Add more roles and counts as needed for Room2
    //     }
    // }
    // Add more rooms as needed
};

const BodyPartsRenderer = {
    'harvester': [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    'builder': [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    'upgrader': [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
    'repairer': [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    'hauler': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    'collector': [CARRY, CARRY, MOVE, MOVE],
    'tombraider': [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    'defender': [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK],
    'ranger': [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK],
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
    let creepsOfType = _.filter(Game.creeps, (creep) => creep.memory.role === role);

    if (creepsOfType.length < creepCounter) {
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
        const bodyParts = BodyPartsRenderer[role];
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

    //Set list of Damage buildings and print their numbers
    DamagedStructures();
    console.log(`Structures to Repair: ${ROOM.memory.damagedStructures.length}`)

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
        'ranger': roleRanger
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
function DamagedStructures() {
    for (let roomName in Game.rooms) {
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {}; // Initialize Memory object for the room if it's undefined
        }

        if (!Memory.rooms[roomName].damagedStructures || Memory.rooms[roomName].damagedStructures.length <= 3) {
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
            damagedStructures.sort((a, b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits));

            // Store the list of damaged structure IDs in Memory
            Memory.rooms[roomName].damagedStructures = _.map(damagedStructures, 'id');
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