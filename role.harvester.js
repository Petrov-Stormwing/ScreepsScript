global.Store=Store;

let roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            Mine(creep);
        } else {
            Store(creep);
        }
    }
};

module.exports = roleHarvester;

function Store(creep) {
    let spawn = getSpawner(creep);
    let extensions = getExtensions(creep);
    let containers = getContainers(creep);

    // Store in Spawner, Extension, or Container
    if (spawn && spawn.store[RESOURCE_ENERGY] < 300) {
        DeliverEnergy(creep, spawn);
    } else if (extensions.length > 0) {
        for (let e = 0; e < extensions.length; e++) {
            if (extensions[e].store[RESOURCE_ENERGY] < 50) {
                DeliverEnergy(creep, extensions[e]);
                return; // Exit the function after delivering to the first extension
            }
        }
    } else if (containers.length > 0) {
        for (let c = 0; c < containers.length; c++) {
            if (containers[c].store[RESOURCE_ENERGY] < 2000) {
                DeliverEnergy(creep, containers[c]);
                return; // Exit the function after delivering to the first container
            }
        }
    }
}

function DeliverEnergy(creep, target) {
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}