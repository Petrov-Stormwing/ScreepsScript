let roleCollector = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setCollectingParameter(creep)
        if (creep.memory.collecting && creep.store.getFreeCapacity() > 0) {
            let resources = FindDroppedResources(creep)
            if (resources && creep.store.getFreeCapacity() > 0) {
                // console.log("Check if Resource is present: " + resources[0]);
                ConductCollection(creep, resources)
            } else {
                creep.moveTo(new RoomPosition(14, 36, creep.room.name))
            }
        } else {
            StoreEnergy(creep);
        }
    }
};

module.exports = roleCollector;

function setCollectingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (!creep.memory.collecting && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.collecting = true;
        creep.say('🔄 Collecting');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (creep.memory.collecting && creep.store[RESOURCE_ENERGY] !== 0) {
        creep.memory.collecting = false;
        creep.say('🚧 Storing');
    }
}

function FindDroppedResources(creep) {
    // Find all dropped energy within a certain range
    let resources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 100);
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