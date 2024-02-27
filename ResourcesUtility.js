require('Utils');
require('lodash');

global.WithdrawEnergy = WithdrawEnergy;
global.TransferEnergy = TransferEnergy;

/**
 * Universal WithdrawEnergy of Energy between Creeps and Structure.
 * @param creep - The empty object.
 * @param container - The full object.
 * @param resource - The Type of Resource to Withdraw
 */
function WithdrawEnergy(creep, container, resource = RESOURCE_ENERGY) {
    if (creep.withdraw(container, resource) === ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

/**
 * Universal TransferToReceiver of Energy between two Objects (Creeps or Structures)
 * @param receiver - This is usually the Creep that can move towards the Provider.
 * @param provider - In most cases that would be a Structure. Sometimes it can be a stationary Creep as well [like Upgrader or Harvester].
 * @param resource
 */
function TransferEnergy(receiver, provider, resource = RESOURCE_ENERGY) {
    if (receiver.transfer(provider, resource) === ERR_NOT_IN_RANGE) {
        receiver.moveTo(provider, {visualizePathStyle: {stroke: '#000000'}});
    }
}