require('ResourcesUtility')

const roleTombraider = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setLootingParameter(creep)
        if (creep.memory.looting) {
            creep.say('🚧 Loot');
            Tombraiding(creep);
            // Haul(creep);
            // WithdrawEnergy(creep, ROOM.storage);
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

module.exports = roleTombraider;
function setLootingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.looting && creep.store.getFreeCapacity() === 0) {
        creep.memory.looting = false;
        creep.say('🔄 Deploy');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.looting && creep.store.getUsedCapacity() === 0) {
        creep.memory.looting = true;
        creep.say('🚧 Loot');
    }
}