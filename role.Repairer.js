require('Utils');

let roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setRepairParameter(creep)
        if (creep.memory.repairing) {
            Repair(creep);
        } else {
            HarvestEnergy(creep);
        }
    }
};

module.exports = roleRepairer;

function setRepairParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.repairing = false;
        creep.say('🔄 Harvest');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
        creep.memory.repairing = true;
        creep.say('🚧 Repair');
    }
}

//Find all Structures in need of repair, order them and repair the one in most dire need.
function Repair(creep) {
    let structuresToRepair = creep.room.find(FIND_STRUCTURES, {
        filter: structure => structure.hits < structure.hitsMax
    });

    if (structuresToRepair.length > 0) {
        structuresToRepair.sort((a, b) => a.hits - b.hits);

        if (creep.repair(structuresToRepair[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(structuresToRepair[0]);
        }
    }
}