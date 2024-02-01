require('ResourcesUtility');
require('Utils');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setBuildingParameter(creep)
        let constructions = ROOM.find(FIND_CONSTRUCTION_SITES);
        if (creep.memory.building) {
            if (constructions.length > 0) {
                Build(creep, constructions);
            } else {
                Reinforce(creep)
            }
        } else {
            WithdrawEnergy(creep, ROOM.storage);
        }
    }
};

module.exports = roleBuilder;

function setBuildingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.building = false;
        creep.say('🔄 harvest');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
        creep.memory.building = true;
        creep.say('🚧 build');
    }
}