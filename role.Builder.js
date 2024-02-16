require('ResourcesUtility');
require('Utils');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setBuildingParameter(creep)
        let storage = Game.rooms['W59S4'].storage;
        let noSties = 0;
        if (creep.memory.building) {
            for (let roomName in Game.rooms) {
                if (Memory.rooms[roomName].constructionSites.length > 0) {
                    Build(creep, roomName);
                } else {
                    noSties++;
                }
            }
            if (noSties === 2) {
                Reinforce(creep);
            }
        } else {
            WithdrawEnergy(creep, storage);
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