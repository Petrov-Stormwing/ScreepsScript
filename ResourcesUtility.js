global.Salvage = Salvage;
global.HarvestEnergy = HarvestEnergy;
global.Mine = Mine;
global.TransferToReceiver = TransferToProvider;
// global.Store=Store;

function Salvage(creep) {
    //Find Ruins
    let ruins = Game.rooms['W59S4'].find(FIND_RUINS);

    //If Ruins in the room Exist, Withdraw existing Energy from them
    if(ruins.length>0) {
        for (let ruin of ruins) {
            if (ruin.store[RESOURCE_ENERGY] > 0) {
                Withdraw(creep, ruin);
                break;
            }
        }
    }else{
        console.log("No Ruins present in the room at the moment");
    }
}

function HarvestEnergy(creep) {
    let spawn = getSpawner(creep);
    let extensions = getExtensions(creep);
    let containers = getContainers(creep);
    if (containers.length > 0) {
        for (let container of containers) {
            if (container.store[RESOURCE_ENERGY] > 0) {
                Withdraw(creep, container);
                return; // Exit the function after delivering to the first container
            }
        }
    } else if (spawn && spawn.store[RESOURCE_ENERGY] < 300) {
        TransferToProvider(creep, spawn);
        return; // Exit the function after delivering to the first container
    }
}

/**
 * Universal Withdraw of Energy between two Objects (Creeps or Structures)
 * @param receiver - The empty object.
 * @param provider - The full object.
 */
function Withdraw(receiver, provider) {
    receiver.moveTo(provider, {range: 1}, {visualizePathStyle: {stroke: '#ffaa00'}});
    receiver.withdraw(provider, RESOURCE_ENERGY);
}

/**
 * Universal TransferToReceiver of Energy between two Objects (Creeps or Structures)
 * @param receiver - The empty object.
 * @param provider - The full object.
 */
function TransferToReceiver(receiver, provider) {
    receiver.moveTo(provider, {range: 1}, {visualizePathStyle: {stroke: '#ffaa00'}});
    receiver.transfer(provider, RESOURCE_ENERGY);
}

/**
 * Universal TransferToProvider of Energy between two Objects (Creeps or Structures)
 * @param provider - The full object.
 * @param receiver - The empty object.
 */
function TransferToProvider(provider, receiver) {
    provider.moveTo(receiver, {range: 1}, {visualizePathStyle: {stroke: '#ffaa00'}});
    provider.transfer(receiver, RESOURCE_ENERGY);
}

//Balanced function to mine from Energy Source
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

    // Harvest from the assigned source
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}