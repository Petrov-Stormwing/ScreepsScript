require('Utils');
require('lodash');

global.WithdrawEnergy = WithdrawEnergy;
global.TransferEnergy = TransferEnergy;
global.TransferAlloys = TransferAlloys;
global.WithdrawAlloys = WithdrawAlloys;

/**
 * Universal WithdrawEnergy of Energy between Creeps and Structure.
 * @param receiver - The empty object.
 * @param provider - The full object.
 */
function WithdrawEnergy(receiver, provider) {
    if (receiver.withdraw(provider, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        receiver.moveTo(provider, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

/**
 * Universal TransferToReceiver of Energy between two Objects (Creeps or Structures)
 * @param receiver - This is usually the Creep that can move towards the Provider.
 * @param provider - In most cases that would be a Structure. Sometimes it can be a stationary Creep as well [like Upgrader or Harvester].
 */
function TransferEnergy(receiver, provider) {
    if (receiver.transfer(provider, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        receiver.moveTo(provider, {visualizePathStyle: {stroke: '#000000'}});
    }
}

/**
 * Used By Tombraiders when robbing invaders corpses.
 * @param creep
 * @param container
 */
function TransferAlloys(creep, container = Game.getObjectById('65d71e80e4219d254f628572')) {
    if (container && creep.pos.isNearTo(container.pos)) {
        // Cycle through resources and deploy them into the container.
        for (const resourceType in creep.store) {
            if (resourceType !== RESOURCE_ENERGY) {
                creep.transfer(container, resourceType);
            }
        }
    } else {
        // console.log(container)
        // console.log(container.pos)

        // Move towards the container if not at it
        creep.moveTo(container, {visualizePathStyle: {stroke: '#f3f3f3'}});
    }
}

/**
 * Useful in the later cases when working with resources.
 * @param creep
 * @param container
 */
function WithdrawAlloys(creep, container) {
    for (const resourceType in container.store) {
        if (resourceType !== RESOURCE_ENERGY) {
            const withdrawResult = creep.withdraw(container, resourceType);
            if (withdrawResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            } else if (withdrawResult !== OK) {
                // Handle any errors or edge cases
                console.log(`Withdraw failed: ${withdrawResult}`);
            }
        }
    }
}