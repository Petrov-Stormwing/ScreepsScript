require('ResourcesUtility')

const roleTombraider = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getUsedCapacity() === 0) {
            Tombraiding(creep);
        } else {
            if (creep.store[RESOURCE_ENERGY]) {
                StoreEnergy(creep);
            } else if (creep.store.getUsedCapacity() !== 0) {
                TransferAlloys(creep);
            }
        }
    }
};

module.exports = roleTombraider;

function Tombraiding(creep) {
    // Find tombstones with resources
    let tombstones = creep.room.find(FIND_TOMBSTONES, {
        filter: tombstone => tombstone.store && Object.keys(tombstone.store).length > 0
    });

    if (tombstones.length > 0) {
        console.log("Number of Tombstones: " + tombstones.length)

        // Harvest from the nearest tombstone
        if (creep.withdraw(tombstones[0], Object.keys(tombstones[0].store)[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(tombstones[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        creep.moveTo(new RoomPosition(16, 36, creep.room.name))
    }
}