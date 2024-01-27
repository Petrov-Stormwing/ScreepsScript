require('ResourcesUtility');

let roleSupplier = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setSupplierParameters(creep)
        if (creep.memory.suppling) {
            SupplyUpgrader(creep)
        } else {
            HarvestEnergy(creep);
        }
    }
};

module.exports = roleSupplier;

function setSupplierParameters(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.suppling && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.suppling = false;
        creep.say('🔄 Recharge');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.suppling && creep.store.getFreeCapacity() === 0) {
        creep.memory.suppling = true;
        creep.say('⚡ Supply');
    }
}

function SupplyUpgrader(supplier) {
    // console.log(upgrader.store[RESOURCE_ENERGY]);
    let upgrader = FindUpgrader(supplier);
    if (upgrader && supplier.store[RESOURCE_ENERGY] > 0){
        if (supplier.transfer(upgrader, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            supplier.moveTo(upgrader, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}

function FindUpgrader(supplier) {
    // Find all friendly harvester creeps within a range that have energy
    let sourceCreeps = Object.values(Game.creeps).filter(upgrader => upgrader.memory.role === 'upgrader');

    // Sort the source creeps based on their energy level (ascending order)
    sourceCreeps.sort((a, b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);

    // Return the harvester creep with the highest energy (first in the sorted array)
    return sourceCreeps[0];
}