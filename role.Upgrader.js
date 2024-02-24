let roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setUpgradingParameter(creep);

        //Define Actions when creep is full of Energy
        if (creep.memory.upgrading) {
            Upgrade(creep);

            //Define Recharging Strategy as per room Level
        } else {
            if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                RechargeCreep(creep, 'S')
            } else {
                RechargeCreep(creep, 'C')
            }

            if (Game.rooms[creep.room.name].controller.level === 1) {
                RechargeCreep(creep, 'M')
            }
        }
    }
};

module.exports = roleUpgrader;

/**
 * @param creep
 */
function setUpgradingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
        creep.memory.upgrading = true;
        creep.say('🔄 Upgrading');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (creep.memory.upgrading && creep.store.getUsedCapacity() === 0) {
        creep.memory.upgrading = false;
        creep.say('🚧 Recharging');
    }
}