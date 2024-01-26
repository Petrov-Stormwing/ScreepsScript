let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleHauler = require('role.hauler');

module.exports.loop = function () {
    const utils = require('Utils')

    let spawn = 'Xel\'Invictus';

    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //Harvester - Find and if necessary Build
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if (harvesters.length < 4) {
        let newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[spawn].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    //Upgrader - Find and if necessary Build
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

    if (upgraders.length < 2) {
        let newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns[spawn].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    //Builder - Find and if necessary Build
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    console.log('Builder: ' + builders.length);

    if (builders.length < 2) {
        let newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[spawn].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,
            {memory: {role: 'builder'}});
    }

    //Haulers - Find and if necessary Build
    let haulers = _.filter(Game.creeps, (creep) => creep.memory.role === 'hauler');
    console.log('Haulers: ' + haulers.length);

    if (haulers.length < 4) {
        let newName = 'Hauler' + Game.time;
        console.log('Spawning new hauler: ' + newName);
        Game.spawns[spawn].spawnCreep([CARRY, CARRY, MOVE, MOVE], newName,
            {memory: {role: 'hauler'}});
    }

    if (Game.spawns[spawn].spawning) {
        let spawningCreep = Game.creeps[Game.spawns[spawn].spawning.name];
        Game.spawns[spawn].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[spawn].pos.x + 1,
            Game.spawns[spawn].pos.y,
            {align: 'left', opacity: 0.8});
    }

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
    }
}

// Game.spawns['Xel\'Invictus'].spawnCreep([CARRY, CARRY, MOVE, MOVE, MOVE], "Hauler" + Game.time, {memory: {role: 'hauler'}});
// Game.spawns['Xel\'Invictus'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE], "Harvester" + Game.time, {memory: {role: 'harvester'}});
// Game.spawns[spawn].spawnCreep([WORK, WORK, WORK, CARRY, MOVE], "harvester" + Game.time, {memory: {role: 'harvester'}});