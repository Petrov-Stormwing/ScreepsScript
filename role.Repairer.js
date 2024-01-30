require('ResourcesUtility');
const _ = require('lodash');

let roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setRepairParameter(creep)
        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] > 0) {
            console.log(`Structures to Repair: ${ROOM.memory.damagedStructures.length}`)
            ConductRepairs(creep);
        } else {
            RechargeCreep(creep);
        }
    }
};

module.exports = roleRepairer;

function setRepairParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.repairing = false;
        creep.say('🔄 Recharge');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
        creep.memory.repairing = true;
        creep.say('🚧 Repair');
    }
}

/**
 * Commences repair based on Room.memory.damagedStructures list. Upon depletion of the list it is automatically renews from main.js
 * @param creep
 */
function ConductRepairs(creep) {
    let repairers = Object.values(Game.creeps).filter(creep => creep.memory.role === 'repairer');
    let structuresID = ROOM.memory.damagedStructures;
    if (repairers.length > 0) for (let r = 0; r < repairers.length; r++) {
        let structure = Game.getObjectById(structuresID[r]);
        if(structure){
            repairers[r].moveTo(structure, {visualizePathStyle: {stroke: '#00aa00'}});
            repairers[r].repair(structure);

            // If Repaired, Remove the structure from the list

            if (structure.hits === structure.hitsMax) {
                ROOM.memory.damagedStructures = _.without(ROOM.memory.damagedStructures, structure.id);
            }
        }
    } else {
        console.log("No CREEPS to conduct Repairs");
    }
}