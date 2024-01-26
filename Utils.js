global.getSpawner = getSpawner;
global.getContainers = getContainers;
global.getExtensions = getExtensions;
global.Salvage = Salvage;
global.HarvestEnergy = HarvestEnergy;
global.Mine = Mine;
global.Store=Store;

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
            && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
}

function Salvage(creep) {
    let ruins = Game.rooms['W59S4'].find(FIND_RUINS);

    // Access the 'store' property to get the actual resource
    let energyInRuins = ruins[1].store[RESOURCE_ENERGY];

    console.log("Ruin content:", energyInRuins);
    // Check if the ruin is not too far away

    creep.moveTo(ruins[1], {visualizePathStyle: {stroke: '#ffaa00'}});
    // Check if there is enough energy in the ruins
    if (energyInRuins > 0) {
        // Use the creep to transfer energy from the ruins to your storage or another container
        let withdrawResult = creep.withdraw(ruins[1], RESOURCE_ENERGY);
        if (withdrawResult === OK) {
            console.log("Successfully withdrew energy from ruins");
        } else {
            console.log("Withdrawal failed with code:", withdrawResult);
        }
    } else {
        console.log("No energy in ruins to withdraw.");
    }
}

function HarvestEnergy(creep) {
    let containers = getContainers(creep);
    if (containers.length > 0) {
        console.log(containers[0].store[RESOURCE_ENERGY])
        if (containers[0].store[RESOURCE_ENERGY] > 0) {
            Drain(creep, containers[0]);
        } else {
            Mine(creep)
        }
    }
}

function Drain(creep, source) {
    // Check if the creep is not too far away from the spawn
    if (source.pos.inRangeTo(creep.pos, 1)) {
        // Use the creep to withdraw energy from the spawn
        creep.withdraw(source, RESOURCE_ENERGY);
    } else {
        // Move towards the spawn if it's not in range
        creep.moveTo(source);
    }
}

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

    // Harvest from the assigned source
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

