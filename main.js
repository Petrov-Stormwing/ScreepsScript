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

global.ROOM = Game.rooms['W59S4'];
global.SPAWN = 'Xel\'Invictus';
global.NORTH_ENERGY_CONTAINER = '65b7e25609c2d1cf9e20b559';
global.SOUTH_ENERGY_CONTAINER = '65b7e57973f23d398567fbc3';
global.CONTROLLER_ENERGY_CONTAINER_I = '65b7fc77ba73c30e2e6a9e67';
global.CONTROLLER_ENERGY_CONTAINER_II = '65b8f767d93405714cd188e2';

const CREEP_COUNTER = {
    'Harvesters': 4,
    'Upgrader': 1,
    'Builders': 1,
    'Repairers': 2,
    'Haulers': 4,
    'Collector': 1,
    'Supplier': 0,
    'Claimer': 0,
    'Defender': 0,
    'Tombraider': 1,
};

module.exports.loop = function () {
    const utils = require('Utils');
    const ResourcesUtility = require('ResourcesUtility');

    BuildHarvesters();
    BuildUpgraders();
    BuildBuilders();
    BuildRepairers();
    BuildHauler();
    BuildCollectors();
    BuildSuppliers();
    BuildClaimer();
    BuildDefender()
    BuildTombraider();
    CreepDrivers()
}

function CreepDrivers() {
    //Clean Memory from Dead Creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //Set list of Damage buildings
    DamagedStructures()

    //Say what you build, Spawner
    if (Game.spawns[SPAWN].spawning) {
        let spawningCreep = Game.creeps[Game.spawns[SPAWN].spawning.name];
        Game.spawns[SPAWN].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[SPAWN].pos.x + 1,
            Game.spawns[SPAWN].pos.y,
            {align: 'left', opacity: 0.8});
    }

    //Initialize the Role of each Creep
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role === 'hauler') {
            roleHauler.run(creep);
        }
        if (creep.memory.role === 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role === 'collector') {
            roleCollector.run(creep);
        }
        if (creep.memory.role === 'supplier') {
            roleSupplier.run(creep);
        }
        if (creep.memory.role === 'claimer') {
            roleClaimer.run(creep);
        }
        if (creep.memory.role === 'defender') {
            roleDefender.run(creep);
        }
        if (creep.memory.role === 'tombraider') {
            roleTombraider.run(creep);
        }
    }
}

//Build the Required Count of Harvesters
function BuildHarvesters() {
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');

    if (harvesters.length < CREEP_COUNTER['Harvesters']) {
        let newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[SPAWN].spawnCreep([WORK, WORK, WORK, CARRY, MOVE], newName,
            {memory: {role: 'harvester'}});
    }
}

//Build the Required Count of Upgraders
function BuildUpgraders() {
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');

    if (upgraders.length < CREEP_COUNTER['Upgrader']) {
        let newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns[SPAWN].spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], newName,
            {memory: {role: 'upgrader'}});
    }
}

//Build the Required Count of Builders
function BuildBuilders() {
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

    if (builders.length < CREEP_COUNTER['Builders']) {
        let newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[SPAWN].spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], newName,
            {memory: {role: 'builder'}});
    }
}

function BuildRepairers() {
    let repairers = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer');

    if (repairers.length < CREEP_COUNTER['Repairers']) {
        let newName = 'Repairer' + Game.time;
        console.log('Spawning new repairer: ' + newName);
        Game.spawns[SPAWN].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'repairer'}});
    }
}

function BuildHauler() {
    let haulers = _.filter(Game.creeps, (creep) => creep.memory.role === 'hauler');

    if (haulers.length < CREEP_COUNTER['Haulers']) {
        let newName = 'Hauler' + Game.time;
        console.log('Spawning new hauler: ' + newName);
        Game.spawns[SPAWN].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'hauler'}});
    }
}

function BuildCollectors() {
    let collectors = _.filter(Game.creeps, (creep) => creep.memory.role === 'collector');

    if (collectors.length < CREEP_COUNTER['Collector']) {
        let newName = 'Collector' + Game.time;
        console.log('Spawning new collector: ' + newName);
        Game.spawns[SPAWN].spawnCreep([CARRY, CARRY, MOVE, MOVE], newName,
            {memory: {role: 'collector'}});
    }
}

function BuildSuppliers() {
    let suppliers = _.filter(Game.creeps, (creep) => creep.memory.role === 'supplier');

    if (suppliers.length < CREEP_COUNTER['Supplier']) {
        let newName = 'Supplier' + Game.time;
        console.log('Spawning new supplier: ' + newName);
        Game.spawns[SPAWN].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'supplier'}});
    }
}

function BuildClaimer() {
    let claimers = _.filter(Game.creeps, (creep) => creep.memory.role === 'claimer');

    if (claimers.length < CREEP_COUNTER['Claimer']) {
        let newName = 'Claimer' + Game.time;
        console.log('Spawning new claimer: ' + newName);
        Game.spawns[SPAWN].spawnCreep([CLAIM, MOVE, MOVE], newName,
            {memory: {role: 'claimer', targetRoom: 'W59S5'}});
    }
}

function BuildDefender() {
    let defenders = _.filter(Game.creeps, (creep) => creep.memory.role === 'defender');

    if (defenders.length < CREEP_COUNTER['Defender']) {
        let newName = 'Defender' + Game.time;
        console.log('Spawning new defender: ' + newName);
        Game.spawns[SPAWN].spawnCreep([TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK], newName,
            {memory: {role: 'defender'}});
    }
}

function BuildTombraider() {
    let tombraiders = _.filter(Game.creeps, (creep) => creep.memory.role === 'tombraider');

    if (tombraiders.length < CREEP_COUNTER['Tombraider']) {
        let newName = 'Tombraider' + Game.time;
        console.log('Spawning new tombraider: ' + newName);
        Game.spawns[SPAWN].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'tombraider'}});
    }
}

//Get Count of all creepers through the Console
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

/**
 * // Check Room memory for Damaged structures. If non, find all, order them by hit points lost and set in memory.
 */
function DamagedStructures() {
    if (!ROOM.memory.damagedStructures || ROOM.memory.damagedStructures.length <= 3) {
        let damagedStructures = ROOM.find(FIND_STRUCTURES, {
            filter: structure => structure.hits < structure.hitsMax
        });

        // Order the damaged structures by their hits difference
        damagedStructures.sort((a, b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits));

        // Store the list in memory
        ROOM.memory.damagedStructures = _.map(damagedStructures, 'id');
    }
}
