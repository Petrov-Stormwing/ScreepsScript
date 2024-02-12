require('ResourcesUtility');
require('Utils');

let roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setRepairParameter(creep);
        let storage = Game.rooms['W59S4'].storage;

        if (creep.memory.repairing) {
            for (let roomName in Game.rooms) {
                if (Memory.rooms[roomName].damagedStructures.length > 0) {
                    Repair(creep, roomName);
                    break;
                }
            }
        } else {
            creep.say('🔄 Recharge');
            WithdrawEnergy(creep, storage)
        }
    }
};

module.exports = roleRepairer;

function setRepairParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.repairing = false;
        creep.say('🔄 Recharge');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
        creep.memory.repairing = true;
        creep.say('🚧 Repair');
    }
}