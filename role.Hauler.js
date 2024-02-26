let roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setHaulerParameter(creep)
        if (creep.memory.hauling) {
            if (RechargeSpawn(creep)) {
                if (RechargeExtension(creep)) {
                    if (RechargeTower(creep)) {
                        let container = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 5, {
                            filter: s => s.structureType === STRUCTURE_CONTAINER
                        });
                        if (container.length > 0 && container[0].store[RESOURCE_ENERGY] < CONTAINER_CAPACITY) {
                            TransferEnergy(creep, container[0]);
                        }
                    }
                }
            }
        } else {
            if (creep.room.storage) {
                WithdrawFromStorage(creep);
            } else {
                WithdrawFromContainer(creep);
            }
        }
    }
};

module.exports = roleHauler;

function setHaulerParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.hauling && creep.store.getUsedCapacity() === 0) {
        creep.memory.hauling = false;
        creep.say('🔄 Reload');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.hauling && creep.store.getFreeCapacity() === 0) {
        creep.memory.hauling = true;
        creep.say('🚧 Haul');
    }
}