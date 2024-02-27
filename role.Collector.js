require('EnergyGridUtility')

let roleCollector = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setCollectingParameter(creep)
        if (creep.memory.collecting) {
            creep.say('🔄 Collecting');
            ConductCollection(creep);
        } else {
            creep.say('🔄 Deploy');
            RechargeStorage(creep);
        }
    }
};

module.exports = roleCollector;

function setCollectingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (!creep.memory.collecting && creep.store.getUsedCapacity() === 0) {
        creep.memory.collecting = true;
        creep.say('🔄 Collecting');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
        creep.memory.collecting = false;
        creep.say('🚧 Storing');
    }
}