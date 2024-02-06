require('ResourcesUtility');

let roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setHaulerParameter(creep)
        if (creep.memory.hauling) {
            // Haul(creep);
            WithdrawEnergy(creep, ROOM.storage);
        } else {
            StoreEnergy(creep);
        }
    }
};

module.exports = roleHauler;

function setHaulerParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.hauling && creep.store.getFreeCapacity() === 0) {
        creep.memory.hauling = false;
        creep.say('🔄 Reload');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.hauling && creep.store.getUsedCapacity() === 0) {
        creep.memory.hauling = true;
        creep.say('🚧 Haul');
    }
}