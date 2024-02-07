require('ResourcesUtility');
require('Utils');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setBuildingParameter(creep)
        if (creep.memory.building) {
            Build(creep);
        } else {
            WithdrawEnergy(creep, Game.getObjectById('65c244a8e30733dc4b44cbbd'));
        }
    }
};

module.exports = roleBuilder;

function setBuildingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.building = false;
        creep.say('🔄 Charge');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
        creep.memory.building = true;
        creep.say('🚧 Build');
    }
}