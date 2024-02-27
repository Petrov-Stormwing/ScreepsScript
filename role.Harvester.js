require('ResourcesUtility')

let roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        Mine(creep);
        let deploymentPoint = Game.getObjectById(creep.memory.sourceId).pos.findInRange(FIND_STRUCTURES, 2, {
            filter: s => s.structureType === STRUCTURE_CONTAINER
                || s.structureType === STRUCTURE_STORAGE
                || s.structureType === STRUCTURE_LINK
        });
        if (deploymentPoint.length > 0 && creep.store[RESOURCE_ENERGY] > 0) {
            if (deploymentPoint[0].structureType === STRUCTURE_STORAGE) {
                RechargeStorage(creep)
            }
            if (deploymentPoint[0].structureType === STRUCTURE_CONTAINER) {
                RechargeContainer(creep);
            }
            if (deploymentPoint[0].structureType === STRUCTURE_LINK) {
                RechargeLink(creep);
            }
        }
        if (creep.store[RESOURCE_ZYNTHIUM] > 0) {
            TransferEnergy(creep, getNearestContainer(creep), RESOURCE_ZYNTHIUM);
        }
    }
};

module.exports = roleHarvester;