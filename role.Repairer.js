require('ResourcesUtility');
const _ = require('lodash');

let roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setRepairParameter(creep)
        if (creep.memory.repairing) {
            console.log(`Structures to Repair: ${ROOM.memory.damagedStructures.length}`)
            ConductRepairs(creep);
        } else {
            RechargeCreep(creep);
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
