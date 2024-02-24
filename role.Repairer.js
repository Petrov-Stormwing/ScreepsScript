let roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setRepairParameter(creep);

        //Define Actions when creep is full of Energy
        if (creep.memory.repairing) {
            if (Memory.rooms[creep.room.name].damagedStructures.length > 0) {
                Repair(creep, creep.room.name);
            } else {
                Reinforce(creep)
            }

        //Define Recharging Strategy as per room Level
        } else {
            if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                RechargeCreep(creep,'S')
            } else {
                RechargeCreep(creep,'C')
            }

            if (Game.rooms[creep.room.name].controller.level === 1) {
                RechargeCreep(creep, 'M')
            }
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