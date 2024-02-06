require('ResourcesUtility')

let roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            let operation_result = Mine(creep);
            if (operation_result !== 1) {
                //Commence Deployment of Creep's Cargo
                if (creep.store[RESOURCE_ENERGY] > 0) {
                    DeployEnergy(creep)
                }
                if (creep.store[RESOURCE_ZYNTHIUM] > 0) {
                    TransferAlloys(creep, Game.getObjectById('65c004cdfc811b3e490a8a12'));
                }
            }
        }
    }
};

module.exports = roleHarvester;