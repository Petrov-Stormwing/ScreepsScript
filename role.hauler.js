require('ResourcesUtility');

let roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            WithdrawSourceContainer(creep)
        } else {
            StoreEnergy(creep);
        }
    }
};

module.exports = roleHauler;

// /** This is Legacy but useful in new room
//  *
//  * @param creep
//  */
// function HaulFromCreepToStorage(creep) {
//     // Find a creep with energy to haul
//     let sourceCreep = FindSourceCreep(creep);
//
//     if (sourceCreep && creep.store.getFreeCapacity() > 0) {
//         HaulFromCreep(creep, sourceCreep);
//     } else {
//         StoreEnergy(creep);
//     }
// }
//
// //Legacy
// function HaulFromCreep(hauler, sourceCreep) {
//     if (sourceCreep.transfer(hauler, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
//         hauler.moveTo(sourceCreep, {visualizePathStyle: {stroke: '#ffffff'}});
//     }
// }
//
// //Legacy
// function FindSourceCreep(hauler) {
//     // Find all friendly harvester creeps within a range that have energy
//     let harvesters = hauler.pos.findInRange(FIND_MY_CREEPS, 5, {
//         filter: (c) => c.memory.role === 'harvester' && c.store[RESOURCE_ENERGY] > 0
//     });
//
//     // Sort the source creeps based on their energy level (descending order)
//     harvesters.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);
//
//     // Return the harvester creep with the highest energy (first in the sorted array)
//     return harvesters[0];
// }