let roleManager = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setManagerParameter(creep)
        let factory = Game.getObjectById('65d71e80e4219d254f628572');
        if (creep.memory.managing) {
            if (creep.store[RESOURCE_ENERGY] > 0) {
                TransferEnergy(creep, factory);
            }
            TransferEnergy(creep, factory, RESOURCE_ZYNTHIUM);
        } else {
            let harvestContainer = Game.getObjectById('65db719aafa71d7c2a2067e9')
            if (factory.store[RESOURCE_ENERGY] < 1000) {
                WithdrawEnergy(creep, creep.room.storage);
            } else {
                if (harvestContainer.store[RESOURCE_ZYNTHIUM] > 200) {
                    WithdrawEnergy(creep, harvestContainer, RESOURCE_ZYNTHIUM)
                } else {
                    WithdrawEnergy(creep, creep.room.storage, RESOURCE_ZYNTHIUM)
                }
            }
        }
    }
};

module.exports = roleManager;

function setManagerParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.managing && creep.store.getUsedCapacity() === 0) {
        creep.memory.managing = false;
        creep.say('🔄 Reload');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.managing && creep.store.getFreeCapacity() === 0) {
        creep.memory.managing = true;
        creep.say('🚧 Manage');
    }
}