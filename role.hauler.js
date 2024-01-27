require('ResourcesUtility');

let roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // Find a creep with energy to haul
        let sourceCreep = FindSourceCreep(creep);

        if (sourceCreep && creep.store.getFreeCapacity() > 0) {
            HaulFromCreep(creep, sourceCreep);
        } else {
            Store(creep);
        }
    }
};

module.exports = roleHauler;

function HaulFromCreep(hauler, sourceCreep) {
    if (sourceCreep.transfer(hauler, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        hauler.moveTo(sourceCreep, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}

function FindSourceCreep(hauler) {
    // Find all friendly harvester creeps within a range that have energy
    let sourceCreeps = hauler.pos.findInRange(FIND_MY_CREEPS, 5, {
        filter: (c) => c.memory.role === 'harvester' && c.store[RESOURCE_ENERGY] > 0
    });

    // Sort the source creeps based on their energy level (descending order)
    sourceCreeps.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);

    // Return the harvester creep with the highest energy (first in the sorted array)
    return sourceCreeps[0];
}

function Store(creep) {
    let spawn = getSpawner(creep);
    let extensions = getExtensions(creep);
    let containers = getContainers(creep);

    // Store in Spawner, Extension, or Container
    if (spawn && spawn.store[RESOURCE_ENERGY] < SPAWN_ENERGY_CAPACITY) {
        TransferToReceiver(creep, spawn);
        return; // Exit the function after delivering to the first container
    }
    if (extensions.length > 0) {
        for (let e = 0; e < extensions.length; e++) {
            if (extensions[e].store[RESOURCE_ENERGY] < 50) {
                TransferToReceiver(creep, extensions[e]);
                return; // Exit the function after delivering to the first extension
            }
        }
    }
    if (containers.length > 0) {
        for (let c = 0; c < containers.length; c++) {
            if (containers[c].store[RESOURCE_ENERGY] < CONTAINER_CAPACITY) {
                TransferToReceiver(creep, containers[c]);
                return; // Exit the function after delivering to the first container
            }
        }
    }
}