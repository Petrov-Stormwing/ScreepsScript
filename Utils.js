global.getSpawner = getSpawner;
global.getContainers = getContainers;
global.getExtensions = getExtensions;
global.getNearestContainer = getNearestContainer;
global.getNearestExtension = getNearestExtension;
global.getStorage = getStorage;

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

function getStorage(creep) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_STORAGE
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