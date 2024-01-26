require('Utils');

let roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setBuildingParameter(creep)
        if (creep.memory.building) {
            Repair(creep);
        } else {
            HarvestEnergy(creep);
        }
    }
};

module.exports = roleRepairer;

function setBuildingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.building = false;
        creep.say('🔄 harvest');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
        creep.memory.building = true;
        creep.say('🚧 repair');
    }
}

function Repair(creep) {
    // Find structures that need repairing
    let structuresToRepair = creep.room.find(FIND_STRUCTURES, {
        filter: structure => structure.hits < structure.hitsMax
    });

    // If there are structures to repair, prioritize repairs
    if (structuresToRepair.length > 0) {
        // Sort the structures by their hits (ascending order)
        structuresToRepair.sort((a, b) => a.hits - b.hits);

        // Repair the structure with the lowest hits first
        if (creep.repair(structuresToRepair[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(structuresToRepair[0]);
        }
    }
}