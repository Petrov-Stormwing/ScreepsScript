let roleCollector = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setCollectingParameter(creep)
        let resources = FindDroppedResources(creep)
        if (resources && creep.store.getFreeCapacity() > 0) {
            // console.log("Check if Resource is present: " + resources[0]);
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
    if (!creep.memory.collecting && creep.store[RESOURCE_ENERGY] !== 0) {
        creep.memory.collecting = false;
        creep.say('🚧 Storing');
    }
}

function FindDroppedResources(creep) {
    // Find all dropped energy within a certain range
    let resources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1000);
    if (resources.length > 0) {
        // Sort dropped energy by amount (descending order)
        resources.sort((a, b) => b.amount - a.amount);
        return resources;
    }
}

function ConductCollection(creep, resources) {
    let collectors = Object.values(Game.creeps).filter(creep => creep.memory.role === 'collector');

    if (collectors.length > 0 && resources.length > 0) {
        for (let c = 0; c < collectors.length; c++) {
            const currentCollector = collectors[c];
            const currentResource = resources[c];

            // Check if the resource is still valid (not picked up by other collectors)
            if (currentResource) {
                if (currentResource.pos) {
                    // Move to the resource's position
                    currentCollector.moveTo(currentResource.pos.x, currentResource.pos.y);
                }

                // Check if the resource is still there before attempting to pick it up
                const pickupResult = currentCollector.pickup(currentResource);

                if (pickupResult === ERR_NOT_IN_RANGE) {
                    // Move towards the resource if not in range
                    currentCollector.moveTo(currentResource);
                } else if (pickupResult === OK) {
                    // The resource was successfully picked up, handle any additional logic here
                    // console.log(`${currentCollector.name} picked up a resource.`);
                } else {
                    // Handle other pickup results or errors
                    // console.log(`${currentCollector.name} encountered an issue while picking up a resource: ${pickupResult}`);
                }
            }
        }
    }
}

function CollectFromTombstone(creep, tombstones) {
    for (let tombstone of tombstones) {
        creep.moveTo(tombstone);
        // Use the creep to withdraw resources from the tombstone
        for (const resourceType in tombstone.store) {
            if (tombstone.store[resourceType] > 0) {
                creep.withdraw(tombstone, resourceType);
            }
        }
    }
}

function Store(creep) {
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