require('ResourcesUtility')

const roleTombraider = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            // Find tombstones with resources
            let tombstones = creep.room.find(FIND_TOMBSTONES, {
                filter: tombstone => tombstone.store && Object.keys(tombstone.store).length > 0
            });

            if (tombstones.length > 0) {
                console.log("Number of Tombstones: " + tombstones.length)
                // Sort tombstones by the distance to the creep
                // tombstones.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));

                // Harvest from the nearest tombstone
                if (creep.withdraw(tombstones[0], Object.keys(tombstones[0].store)[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tombstones[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            if(creep.store[RESOURCE_ENERGY]){
                StoreEnergy(creep);
            }
            if(creep.store[RESOURCE_ALLOY]) {
                TransferAlloys(creep);
            }
        }
    }
};

module.exports = roleTombraider;