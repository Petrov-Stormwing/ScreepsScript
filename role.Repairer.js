require('Utils');

let roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setRepairParameter(creep)
        if (creep.memory.repairing) {
            let structures = FindDamagedStructures(creep);
            ConductRepairs(creep, structures);
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

/**
 * Find all Structures in need of repair. Provide them sorted by percentile damage to the conducting the repair function.
 * @param creep
 * @returns {*}
 */
function FindDamagedStructures(creep) {
    let structuresToRepair = creep.room.find(FIND_STRUCTURES, {
        filter: structure => structure.hits < structure.hitsMax
    });
    if (structuresToRepair.length > 0) {
        // structuresToRepair.sort((a, b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits));
        return structuresToRepair;
    } else {
        console.log("No STRUCTURES to repair in this room at the moment");
    }
}

/**
 * Commences repair.
 * @param creep
 * @param structures
 */
function ConductRepairs(creep, structures) {
    let repairers = Object.values(Game.creeps).filter(creep => creep.memory.role === 'repairer');
    if (repairers.length > 0) {
        for (let r = 0; r < repairers.length; r++) {
            repairers[r].moveTo(structures[r], {range: 1});
            repairers[r].repair(structures[r]);
        }
    } else {
        console.log("No CREEPS to conduct Repairs");
    }
}