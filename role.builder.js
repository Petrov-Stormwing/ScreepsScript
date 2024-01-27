require('ResourcesUtility');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setBuildingParameter(creep)

        if (creep.memory.building) {
            Build(creep);
        } else {
            HarvestEnergy(creep);
        }
    }
};

module.exports = roleBuilder;

function setBuildingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.building = false;
        creep.say('🔄 harvest');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
        creep.memory.building = true;
        creep.say('🚧 build');
    }
}

function Build(creep) {
    let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}
