require('ResourcesUtility')

const roleTombraider = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            Tombraiding(creep);
        } else {
            console.log(`Energy ${creep.store[RESOURCE_ENERGY]}`)
            if (creep.store[RESOURCE_ENERGY]>0) {
                StoreEnergy(creep);
            } else if (creep.store.getUsedCapacity() !== 0) {
                TransferAlloys(creep,Game.getObjectById(CONTROLLER_ENERGY_CONTAINER_II));
            }
        }
    }
};

module.exports = roleTombraider;

function Tombraiding(creep) {
    // Find tombstones with resources
    let tombstones = getTombstones(creep)

    if (tombstones.length > 0) {
        console.log("Number of Tombstones: " + tombstones.length)

        // Harvest from the nearest tombstone
        if (creep.withdraw(tombstones[0], Object.keys(tombstones[0].store)[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(tombstones[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        creep.moveTo(new RoomPosition(16, 36, ROOM.name))
    }
}