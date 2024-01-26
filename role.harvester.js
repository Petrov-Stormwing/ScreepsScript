let roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            Mine(creep);
        }
    }
};

module.exports = roleHarvester;

