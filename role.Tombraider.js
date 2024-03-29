const roleTombraider = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setLootingParameter(creep)
        if (creep.memory.looting) {
            creep.say('🚧 Loot');
            Tombraiding(creep);
        } else {
            creep.say('🔄 Deploy');
            RechargeStorage(creep);
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