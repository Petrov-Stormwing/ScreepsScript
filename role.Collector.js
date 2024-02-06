let roleCollector = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setCollectingParameter(creep)
        if (creep.memory.collecting) {
            creep.say('🔄 Collecting');
            ConductCollection(creep);
            // Haul(creep);
            // WithdrawEnergy(creep, Game.getObjectById('65c004cdfc811b3e490a8a12'));
        } else {
            creep.say('🔄 Deploy');
            if (creep.store[RESOURCE_ENERGY] > 0) {
                StoreEnergy(creep);
            } else if (creep.store.getUsedCapacity() > 0) {
                TransferAlloys(creep, ROOM.storage);
            }
        }
    }
};

module.exports = roleCollector;

function setCollectingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (!creep.memory.collecting && creep.store.getUsedCapacity() === 0) {
        creep.memory.collecting = true;
        creep.say('🔄 Collecting');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
        creep.memory.collecting = false;
        creep.say('🚧 Storing');
    }
}