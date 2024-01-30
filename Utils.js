const _ = require("lodash");
global.getSpawner = getSpawner;
global.getContainers = getContainers;
global.getExtensions = getExtensions;
global.getNearestContainer = getNearestContainer;
global.getNearestExtension = getNearestExtension;
global.ConductRepairs=ConductRepairs;
function getSpawner(creep) {
    return creep.room.find(FIND_MY_SPAWNS)[0];
}

// Find all containers in the room
function getContainers(creep) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_CONTAINER
    });
}

function getExtensions(creep) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
            && structure.store[RESOURCE_ENERGY] < EXTENSION_ENERGY_CAPACITY[creep.room.controller.level]
    });
}

function getNearestContainer(creep) {
    let containers = getContainers(creep)
    if (containers.length > 0) {
        return creep.pos.findClosestByPath(containers);
    } else {
        console.log("No Containers in this Room")
    }
}

function getNearestExtension(creep) {
    let extensions = getExtensions(creep)
    if (extensions.length > 0) {
        return creep.pos.findClosestByPath(extensions);
    } else {
        console.log(`No Extensions in Room: ${creep.room.name}`)
    }
}

/**
 * Commences repair based on Room.memory.damagedStructures list. Upon depletion of the list it is automatically renews from main.js
 * @param creep
 */
function ConductRepairs(creep) {
    let repairers = Object.values(Game.creeps).filter(creep => creep.memory.role === 'repairer' );
    let structuresID = ROOM.memory.damagedStructures;

    if (repairers.length > 0) for (let r = 0; r < repairers.length; r++) {
        let structure = Game.getObjectById(structuresID[r]);
        if(structure){
            repairers[r].moveTo(structure, {visualizePathStyle: {stroke: '#00aa00'}});
            repairers[r].repair(structure);

            // If Repaired, Remove the structure from the list
            if (structure.hits === structure.hitsMax) {
                ROOM.memory.damagedStructures = _.without(ROOM.memory.damagedStructures, structure.id);
            }
        }
    } else {
        console.log("No CREEPS to conduct Repairs");
    }
}