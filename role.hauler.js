require('ResourcesUtility');

let roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            let sources = [
                Game.getObjectById(NORTH_ENERGY_CONTAINER),
                Game.getObjectById(SOUTH_ENERGY_CONTAINER),
            ];
            sources.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);

            WithdrawEnergy(creep,sources[0]);
        } else {
            StoreEnergy(creep);
        }
    }
};

module.exports = roleHauler;