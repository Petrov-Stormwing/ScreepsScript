require('lodash');

global.RechargeSpawn = RechargeSpawn;
global.RechargeExtension = RechargeExtension;
global.RechargeContainer = RechargeContainer;
global.RechargeLink = RechargeLink;
global.RechargeStorage = RechargeStorage;
global.RechargeTower = RechargeTower;
global.RechargeCreep = RechargeCreep;

global.WithdrawFromCreep = WithdrawFromCreep;
global.WithdrawFromContainer = WithdrawFromContainer;
global.WithdrawFromStorage = WithdrawFromStorage;

// region Section 1: Recharge Functions
/**
 * Dedicated Function for Spawn Recharge
 * @param creep
 */
function RechargeSpawn(creep) {
    //Find the Spawns
    let allSpawn = creep.room.find(FIND_MY_SPAWNS, {
        filter: spawn => spawn.store[RESOURCE_ENERGY] < SPAWN_ENERGY_CAPACITY
    });

    //If there are empty spawns, charge the closest or return true to continue to the next objects.
    if (allSpawn.length > 0) {
        let spawn = creep.pos.findClosestByPath(allSpawn);
        creep.say('🔄 Spawn');
        TransferEnergy(creep, spawn);
    } else {
        return true;
    }
}

/**
 * Dedicated Function for Extension Recharge
 * @param creep
 */
function RechargeExtension(creep) {
    //Find the Extensions
    let allExtensions = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
            && structure.store[RESOURCE_ENERGY] < EXTENSION_ENERGY_CAPACITY[creep.room.controller.level]
    });

    //If there are empty extensions, charge the closest or return true to continue to the next objects.
    if (allExtensions.length > 0) {
        creep.say('🔄 E');
        let extension = creep.pos.findClosestByPath(allExtensions);
        TransferEnergy(creep, extension);
    } else {
        return true;
    }
}

/**
 * Store any Resource to an Empty Container.
 * @param creep
 * @param resource
 */
function RechargeContainer(creep, resource = RESOURCE_ENERGY) {
    //Find the Container
    let allContainers = creep.room.find(FIND_STRUCTURES, {
        filter: container => container.structureType === STRUCTURE_CONTAINER
            && container.store[resource] < CONTAINER_CAPACITY
    });

    //Take the closest one and Recharge it.
    if (allContainers.length > 0) {
        let container = creep.pos.findClosestByPath(allContainers)
        if (container && container.store.getUsedCapacity() < CONTAINER_CAPACITY) {
            creep.say('🔄 C');
            TransferEnergy(creep, container);
        }
    }
}

/**
 * Recharges the nearest Link
 * @param creep
 */
function RechargeLink(creep) {
    let allLinks = creep.room.find(FIND_MY_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_LINK
            && structure.energy < structure.energyCapacity
    });
    if (allLinks.length > 0) {
        let link = creep.pos.findClosestByPath(allLinks);
        if (creep.transfer(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(link);
        }
    }
}

/**
 * If nothing passes through the other 3 functions, everything goes into the storage.
 * @param creep
 */
function RechargeStorage(creep) {
    let storage = creep.room.storage;
    if (storage) {
        TransferEnergy(creep, storage)
    }
}

/**
 * Recharges Towers and returns true if the recharge is complete
 * @param creep
 * @returns {boolean}
 */
function RechargeTower(creep){
    //Find the Towers
    let allTowers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_TOWER
            && structure.store[RESOURCE_ENERGY] < TOWER_CAPACITY
    });

    //If there are empty tower, charge the closest or return true to continue to the next objects.
    if (allTowers.length > 0) {
        creep.say('🔄 T');
        let tower = creep.pos.findClosestByPath(allTowers);
        TransferEnergy(creep, tower);
    } else {
        return true;
    }
}

/**
 * Recharges the Creeps energy to continue performing operations. Used by Builder and Repairer.
 * Store can be of string equal to S for Storage and C for Container.
 * @param creep
 * @param store
 */
function RechargeCreep(creep, store = 'S') {
    switch (store) {
        case 'S':
            let storage = creep.room.storage;
            if (storage && storage.store[RESOURCE_ENERGY] > 0) {
                WithdrawEnergy(creep, storage);
            }
            break;
        case 'C':
            let container = creep.room.find(FIND_STRUCTURES, {
                filter: container => container.structureType === STRUCTURE_CONTAINER
                    && container.store[RESOURCE_ENERGY] > 0
            });
            if (container) {
                WithdrawEnergy(creep, creep.pos.findClosestByPath(container));
            }
            break;
        case 'L':
            let link = creep.room.find(FIND_STRUCTURES, {
                filter: container => container.structureType === STRUCTURE_CONTAINER
                    && container.store[RESOURCE_ENERGY] > 0
            });
            if (link) {
                WithdrawEnergy(creep, creep.pos.findClosestByPath(link));
            }
            break;
        case 'M':
            Mine(creep);
    }
}

// endregion

// region Section 2: Withdraw Functions
//WIP
/**
 * Withdrawal of items from Creep.
 * @param creep
 */
function WithdrawFromCreep(creep) {

}

function WithdrawFromContainer(creep) {
    let allContainerFull = creep.room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_CONTAINER
            && structure.store[RESOURCE_ENERGY] > 0
    });
    if (allContainerFull.length > 0) {
        let containerFull = creep.pos.findClosestByPath(allContainerFull);
        WithdrawEnergy(creep, containerFull);
    }
}

function WithdrawFromStorage(creep) {
    let storage = creep.room.storage;
    if (storage) {
        WithdrawEnergy(creep, storage)
    }
}

//endregion

// region Section 3: Supply Functions
//WIP
function SupplyFactory(creep) {
    if (creep.room.controller.level < 7) {
        return;
    }
    let factory = creep.room.find(FIND_MY_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_FACTORY
    });
    if (factory !== null) {
        TransferAlloys(creep);
    }
}

function SupplyTerminal(creep) {
    let terminal = creep.room.find(FIND_MY_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_TERMINAL
    });
    if (terminal !== null) {
        TransferAlloys(creep);
    }
}

//endregion