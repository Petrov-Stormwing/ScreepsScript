let roleCollector = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setCollectingParameter(creep)
        let resources=FindDroppedResources(creep)
        if (resources && creep.store.getFreeCapacity() > 0) {
            ConductCollection(creep, resources)
        } else {
            Store(creep);
        }
    }
};

module.exports = roleCollector;

function setCollectingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.collecting && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.collecting = true;
        creep.say('🔄 Collecting');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
        creep.memory.collecting = false;
        creep.say('🚧 Storing');
    }
}

function FindDroppedResources(creep){
    // Find all dropped energy within a certain range
    let resources = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1000);
    if (resources.length > 0) {
        // Sort dropped energy by amount (descending order)
        resources.sort((a, b) => b.amount - a.amount);
        return resources;
    }else {
        console.log("No Dropped Resources")
    }
}

function ConductCollection(creep, resources) {
    let collectors = Object.values(Game.creeps).filter(creep => creep.memory.role === 'collector');
    if (collectors.length > 0) {
        for (let c = 0; c < resources.length; c++) {
            collectors[c].moveTo(resources[c], {range: 1});
            collectors[c].repair(resources[c]);
        }
    } else {
        console.log("No CREEPS to conduct Collection");
    }
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