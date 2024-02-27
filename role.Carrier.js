let roleCarrier = {

    /** @param {Creep} creep
     * Designed as an Inter-Room Fearing Creep
     */
    run: function (creep) {
        setCarrierParameter(creep)
        if (creep.memory.carrier) {
            creep.memory.targetRoom = 'W59S4'

            if (creep.room.name !== creep.memory.targetRoom) {
                creep.moveTo(new RoomPosition(28, 14, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ffaa00'}});
            } else {
                if (creep.room.storage) {
                    WithdrawEnergy(creep, Game.rooms['W59S4'].storage);
                } else {
                    let containers = getEnergyContainers(creep);
                    creep.moveTo(new RoomPosition(14, 46, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ffaa00'}});
                    WithdrawEnergy(creep, getEnergyContainers(creep)[0]);
                }
            }
        } else {
            creep.memory.targetRoom = 'W59S5'

            if (creep.room.name !== creep.memory.targetRoom) {
                creep.moveTo(new RoomPosition(28, 14, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ffaa00'}});
            } else {
                if (RechargeSpawn(creep)) {
                    if (RechargeExtension(creep)){
                        TransferEnergy(creep, Game.getObjectById('65d51e16d7c47401cfc6bf95'))
                    }
                }
            }
        }
    }
};

module.exports = roleCarrier;

/**
 *
 * @param creep
 */
function setCarrierParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.carrier && creep.store.getFreeCapacity() === 0) {
        creep.memory.carrier = false;
        creep.say('🔄 Reload');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.carrier && creep.store.getUsedCapacity() === 0) {
        creep.memory.carrier = true;
        creep.say('🚧 Haul');
    }
}