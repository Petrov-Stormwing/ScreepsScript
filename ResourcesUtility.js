require('Utils');
const _ = require('lodash');

global.HarvestEnergy = HarvestEnergy;
global.Withdraw = WithdrawEnergy;
global.Transfer = Transfer;
global.Salvage = Salvage;
global.Mine = Mine;
global.TransferAlloys = TransferAlloys;
global.StoreEnergy=StoreEnergy;

function HarvestEnergy(creep) {
    let containers = getContainers(creep);
    if (containers.length > 0) {
        for (let container of containers) {
            if (container.store[RESOURCE_ENERGY] > 0) {
                WithdrawEnergy(creep, container);
                break;
            }
        }
    }
}

/**
 * Universal WithdrawEnergy of Energy between two Objects (Creeps or Structures)
 * @param receiver - The empty object.
 * @param provider - The full object.
 */
function WithdrawEnergy(receiver, provider) {
    receiver.moveTo(provider, {visualizePathStyle: {stroke: '#ffaa00'}});
    receiver.withdraw(provider, RESOURCE_ENERGY);
}

/**
 * Universal TransferToReceiver of Energy between two Objects (Creeps or Structures)
 * @param receiver - The empty object.
 * @param provider - The full object.
 */
function Transfer(receiver, provider) {
    console.log("Transfering")
    receiver.moveTo(provider, {visualizePathStyle: {stroke: '#ffaa00'}});
    receiver.transfer(provider, RESOURCE_ENERGY);
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
                WithdrawEnergy(creep, ruin);
                break;
            }
        }
    } else {
        console.log("No Ruins present in the room at the moment");
    }
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
    if (source) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        creep.harvest(source)
    }
}

function storeMineralsInEmptyContainer(creep) {
    // let containers = creep.room.find(FIND_STRUCTURES, {
    //     filter: structure => structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity() === 2000
    // });
     // Replace 'yourContainerId' with the actual container ID
    // TransferMinerals(creep,container)/
    // if (containers.length > 0) {
    //     for (let container of containers) {
    //         let opreationResult = TransferMinerals(creep, container)
    //         if (opreationResult === "OK") {
    //             return;
    //         }
    //     }
    //     creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}});

    //  else {
    //     console.log("No empty containers available.");
    // }
}

function TransferAlloys(creep) {
    let container = Game.getObjectById('65b746c9d1fecc4522265a4b');
    if (creep.pos.isEqualTo(container.pos)) {
        // Check if the creep is already on the container
        for (const resourceType in creep.store) {
            if (resourceType !== RESOURCE_ENERGY) {
                // Transfer non-energy resources (assumed to be alloys) to the container
               console.log(creep.store[RESOURCE_ENERGY]);
                creep.transfer(container, resourceType);
            }
        }
    } else {
        // Move towards the container if not on it
        creep.moveTo(container, { visualizePathStyle: { stroke: '#ffffff' } });
    }
}

function StoreEnergy(creep) {
    let spawn = getSpawner(creep);
    let extensions = getExtensions(creep);
    let containers = getContainers(creep);

    // Store in Spawner, Extension, or Container
    if (spawn && spawn.store[RESOURCE_ENERGY] < SPAWN_ENERGY_CAPACITY) {
        Transfer(creep, spawn);
        return; // Exit the function after delivering to the first container
    }
    if (extensions.length > 0) {
        for (let e = 0; e < extensions.length; e++) {
            if (extensions[e].store[RESOURCE_ENERGY] < 50) {
                Transfer(creep, extensions[e]);
                return; // Exit the function after delivering to the first extension
            }
        }
    }
    if (containers.length > 0) {
        for (let c = 0; c < containers.length; c++) {
            if (containers[c].store[RESOURCE_ENERGY] < CONTAINER_CAPACITY) {
                Transfer(creep, containers[c]);
                return; // Exit the function after delivering to the first container
            }
        }
    }
}