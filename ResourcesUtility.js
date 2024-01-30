require('Utils');
const _ = require('lodash');

global.RechargeCreep = RechargeCreep;
global.WithdrawSourceContainer = WithdrawSourceContainer;
global.WithdrawEnergy = WithdrawEnergy;
global.TransferEnergy = TransferEnergy;
global.DeployEnergy = DeployEnergy;
global.StoreEnergy = StoreEnergy;
global.Salvage = Salvage;
global.Mine = Mine;
global.TransferAlloys = TransferAlloys;

function RechargeCreep(creep) {
    let container = getNearestContainer(creep);
    if (container && container.store[RESOURCE_ENERGY] > 0) {
        WithdrawEnergy(creep, container);
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
 * Used for the purpose of draining energy from Ruins if present in the room.
 * @param creep
 */
function Salvage(creep) {
    //Find Ruins
    let ruins = Game.rooms['W59S4'].find(FIND_RUINS);

    //If Ruins in the room Exist, WithdrawEnergy existing Energy from them
    if (ruins.length > 0) {
        for (let ruin of ruins) {
            if (ruin.store[RESOURCE_ENERGY] > 0) {
                WithdrawEnergy(creep, ruin);
                break;
            }
        }
    } else {
        console.log("No Ruins present in the room at the moment");
    }
}

/**
 * Balanced and Optimized function to Mine from Energy Source
 * @param creep
 */
function Mine(creep) {
    // Check if the creep already has a source assigned
    if (!creep.memory.sourceId) {
        // If not, find the sources in the room
        let sources = creep.room.find(FIND_SOURCES);

        // Find the least assigned source among all creeps
        let leastAssignedSource = _.min(sources, source => _.filter(Game.creeps, c => c.memory.sourceId === source.id).length);

        // Assign the least assigned source to the creep
        creep.memory.sourceId = leastAssignedSource.id;
    }

    // Get the assigned source based on the memory
    let source = Game.getObjectById(creep.memory.sourceId);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

/**
 * Used By Tombraiders when robbing invaders corpses.
 * @param creep
 */
function TransferAlloys(creep) {
    let container = Game.getObjectById(CONTROLLER_ENERGY_CONTAINER_II)
    if (creep.pos.isEqualTo(container.pos)) {

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
 * //General Storage Function. Prioritizes Spawn and Extensions, followed by Containers and Storage.
 * @param creep
 */
function StoreEnergy(creep) {
    let spawn = getSpawner(creep);
    let extensions = getExtensions(creep);
    let containers = [
        Game.getObjectById(CONTROLLER_ENERGY_CONTAINER_I),
        Game.getObjectById(CONTROLLER_ENERGY_CONTAINER_II)
    ]
    let storage=getStorage(creep);

    //Supply the Spawn
    if (spawn && spawn.store[RESOURCE_ENERGY] < 300) {
        creep.say('🔄 S');
        TransferEnergy(creep, spawn);
        console.log(`Spawner Energy: ${spawn.store[RESOURCE_ENERGY]}/${SPAWN_ENERGY_CAPACITY}`)

    //Else, Supply the Extensions
    } else if (creep.store[RESOURCE_ENERGY] > 0 && extensions.length > 0) {
        creep.say('🔄 E');
        TransferEnergy(creep, extensions[0]);
        console.log(`Extension Energy: ${extensions[0].store[RESOURCE_ENERGY]}/${EXTENSION_ENERGY_CAPACITY[creep.room.controller.level]}`);

    //Else, Supply the First Upgrader Storage
    } else if (creep.store[RESOURCE_ENERGY] && containers[0].store.getFreeCapacity() > 0) {
        creep.say('🔄 U-I');
        TransferEnergy(creep, containers[0])
        console.log(`Container I Energy: ${containers[0].store[RESOURCE_ENERGY]}`);

    //Else, Supply the Second Upgrader Storage
    } else if (containers[1] && creep.store[RESOURCE_ENERGY] && containers[1].store.getFreeCapacity() > 0) {
        creep.say('🔄 U-II');
        TransferEnergy(creep, containers[1])
        console.log(`Container II Energy: ${containers[1].store[RESOURCE_ENERGY]}`);

    //Else, Supply the Main Storage
    } else if (creep.store[RESOURCE_ENERGY]) {
        creep.say('🔄 SS');
        TransferEnergy(creep,storage);
        console.log(`Main Storage Energy: ${containers[1].store[RESOURCE_ENERGY]}`);
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

/**
 * Used by Haulers to take energy from the storage Container of the Harvesters only and move it elsewhere.
 * @param creep
 */
function WithdrawSourceContainer(creep) {
    let sources = [
        Game.getObjectById(NORTH_ENERGY_CONTAINER),
        Game.getObjectById(SOUTH_ENERGY_CONTAINER),
    ];
    sources.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);
    WithdrawEnergy(creep, sources[0]);
}