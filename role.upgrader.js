let roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setUpgradeParameters(creep)

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            HarvestEnergy(creep)
        }
    }
};

module.exports = roleUpgrader;

function setUpgradeParameters(creep) {
    // Stop Upgrading, Start Harvesting
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.upgrading = false;
        creep.say('🔄 harvest');
    }
    // Stop Harvesting, Start Upgrading
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
        creep.memory.upgrading = true;
        creep.say('⚡ upgrade');
    }
}
