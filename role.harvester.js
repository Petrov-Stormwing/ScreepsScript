require('ResourcesUtility')

let roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            Mine(creep);
        // }else{
            if (creep.store[RESOURCE_ENERGY] > 0) {
                DeployToLink(creep)
            }
            if (creep.store[RESOURCE_ZYNTHIUM] > 0) {
                TransferAlloys(creep, getNearestContainer(creep));
            }
        }
    }
};

module.exports = roleHarvester;