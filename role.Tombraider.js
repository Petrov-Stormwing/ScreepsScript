require('ResourcesUtility')

const roleTombraider = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            console.log("Raider");
            // Find tombstones with resources
            let tombstones = creep.room.find(FIND_TOMBSTONES, {
                filter: tombstone => tombstone.store && Object.keys(tombstone.store).length > 0
            });

            if (tombstones.length > 0) {
                console.log(tombstones.length)
                // Sort tombstones by the distance to the creep
                // tombstones.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));

                // Harvest from the nearest tombstone
                if (creep.withdraw(tombstones[0], Object.keys(tombstones[0].store)[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tombstones[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        } else {
            Store(creep);
        }
    }
};

module.exports = roleTombraider;

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