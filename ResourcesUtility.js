require('Utils');
require('lodash');
global.RechargeCreep = RechargeCreep;
global.WithdrawEnergy = WithdrawEnergy;
global.TransferEnergy = TransferEnergy;
global.DeployEnergy = DeployEnergy;
global.DeployToLink = DeployToLink;
global.StoreEnergy = StoreEnergy;
global.TransferAlloys = TransferAlloys;
global.WithdrawAlloys = WithdrawAlloys;

/**
 * Recharges the Creeps energy to continue performing operations. Used by Builder and Repairer
 * In rooms with NO STORAGE ONLY
 * @param creep
 */
function RechargeCreep(creep) {
    let container = getContainers(creep);
    for (container of container){
        if(container.store[RESOURCE_ENERGY]>0){
            WithdrawEnergy(creep, container);
            break;
        }
    }
}

/**
 * Used by the Miners to deploy in the nearest Storage - right next to them.
 * Later to be replaced by Link.
 * @param creep
 */
function DeployEnergy(creep) {
    let container = getNearestContainer(creep);
    if (container.store.getFreeCapacity() > 0) {
        TransferEnergy(creep, container)
    }
}

function DeployToLink(creep){
    let link = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
        filter: structure => structure.structureType === STRUCTURE_LINK
    })[0];
    if (link && link.energy < link.energyCapacity) {
        if (creep.transfer(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(link);
        }
    }
}
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
 * General Storage Function. Prioritizes Spawn and Extensions, followed by Storage.
 * It is Modified to Work with Minerals as well.
 * @param creep
 */
function StoreEnergy(creep) {
    let spawn = getSpawner(creep);
    let extension = getNearestExtension(creep);
    let storage = ROOM.storage

    //Supply the Spawn
    if (spawn && spawn.store[RESOURCE_ENERGY] < 300 && creep.store[RESOURCE_ENERGY] > 0) {
        creep.say('🔄 S');
        TransferEnergy(creep, spawn);
        // console.log(`Spawner Energy: ${spawn.store[RESOURCE_ENERGY]}/${SPAWN_ENERGY_CAPACITY}`)

        //Else, Supply the Extensions
    } else if (extension && creep.store[RESOURCE_ENERGY] > 0) {
        creep.say('🔄 E');
        TransferEnergy(creep, extension);
        // console.log(`Extension Energy: ${extensions[0].store[RESOURCE_ENERGY]}/${EXTENSION_ENERGY_CAPACITY[creep.room.controller.level]}`);

        //Else, Supply the Main Storage
    } else if (storage && (creep.store[RESOURCE_ENERGY] || creep.store.getUsedCapacity() > 0)) {
        creep.say('🔄 SS');
        TransferEnergy(creep, storage);
        TransferAlloys(creep,storage);
        //console.log(`Main Storage Energy: ${storage.store[RESOURCE_ENERGY]}`);
    }
}

/**
 * Used By Tombraiders when robbing invaders corpses.
 * @param creep
 * @param container
 */
function TransferAlloys(creep, container) {
    if (creep.pos.isNearTo(container.pos)) {
        // Cycle through resources and deploy them into the container.
        for (const resourceType in creep.store) {
            if (resourceType !== RESOURCE_ENERGY) {
                creep.transfer(container, resourceType);
            }
        }
    } else {
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