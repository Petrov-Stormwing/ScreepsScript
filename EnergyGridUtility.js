require('lodash');

global.RechargeSpawn = RechargeSpawn;
global.RechargeExtension = RechargeExtension;
global.RechargeContainer = RechargeContainer;
global.RechargeStorage = RechargeStorage;
global.RechargeCreep = RechargeCreep;
global.WithdrawFromCreep = WithdrawFromCreep;
global.WithdrawFromContainer = WithdrawFromContainer;
global.WithdrawFromStorage = WithdrawFromStorage;
global.SupplyFactory = SupplyFactory;

// region Section 1: Recharge Functions
/**
 * Dedicated Function for Spawn Recharge
 * @param creep
 */
function RechargeSpawn(creep) {
    //Find the Spawn
    let spawn = creep.room.find(FIND_MY_SPAWNS)[0];

    //Supply the Spawn
    if (spawn && spawn.store[RESOURCE_ENERGY] < SPAWN_ENERGY_CAPACITY) {
        creep.say('🔄 Spawn');
        TransferEnergy(creep, spawn);
    }

    return spawn.store[RESOURCE_ENERGY] === SPAWN_ENERGY_CAPACITY
}

/**
 * Dedicated Function for Extension Recharge
 * @param creep
 */
function RechargeExtension(creep) {
    //Find the Extension
    let allExtensions = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
            && structure.store[RESOURCE_ENERGY] < EXTENSION_ENERGY_CAPACITY[creep.room.controller.level]
    });

    //If there are empty extensions, charge the closest or return true to continue to the next objects.
    if (allExtensions.length > 0) {
        let extension = creep.pos.findClosestByPath(allExtensions);
        let extensionMaxCapacity = EXTENSION_ENERGY_CAPACITY[creep.room.controller.level];

        //Supply the Extension
        if (extension && extension.store[RESOURCE_ENERGY] < extensionMaxCapacity) {
            creep.say('🔄 E');
            TransferEnergy(creep, extension);
        }
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
    let container = creep.room.find(FIND_STRUCTURES, {
        filter: container => container.structureType === STRUCTURE_CONTAINER
            && container.store[resource] < CONTAINER_CAPACITY
    });

    //Take the closest one
    container = creep.pos.findClosestByPath(container)

    //Supply the Spawn
    if (container && container.store[resource] > 0) {
        creep.say('🔄 C');
        TransferEnergy(creep, container);
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
        case 'M':
            Mine(creep);
    }
}

// endregion

// region Section 2: Withdraw Functions
/**
 * Withdrawal of items from Creep.
 * @param creep
 */
function WithdrawFromCreep(creep) {

}

function WithdrawFromContainer(creep) {
    let container = getEnergyContainers(creep);
    for (container of container) {
        if (container.store[RESOURCE_ENERGY] > 0) {
            WithdrawEnergy(creep, container);
            break;
        }
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

function SupplyTurret(creep) {

}

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

//endregion