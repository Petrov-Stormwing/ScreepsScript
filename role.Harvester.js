require('ResourcesUtility')

let roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.controller.level >= 6) {
            if (creep.store.getFreeCapacity() === 0) {
                DeployToLink(creep);
                if (creep.store[RESOURCE_ZYNTHIUM] > 0) {
                    TransferAlloys(creep, getNearestContainer(creep));
                }
            }
            if (creep.store.getFreeCapacity() > 0) {
                Mine(creep);
                if (creep.store[RESOURCE_ENERGY] > 0) {
                    DeployToLink(creep)
                }
                if (creep.store[RESOURCE_ZYNTHIUM] > 0) {
                    TransferAlloys(creep, getNearestContainer(creep));
                }
            }
        } else{
            Mine(creep);
            DeployEnergy(creep);
        }
    }
};

module.exports = roleHarvester;