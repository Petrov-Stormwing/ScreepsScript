let roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // DrainHarvester(creep);
    }
};

module.exports = roleHauler;

function DrainHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        let harvesterCreeps = findCreepsByRole('harvester');
        for (let harvester of harvesterCreeps) {
            if (harvester.store.getFreeCapacity() === 0) {
                Drain(creep, harvester);
                break;
            }
        }
    } else {
        Store(creep);
    }
}