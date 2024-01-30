require('ResourcesUtility');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setBuildingParameter(creep)

        if (creep.memory.building) {
            Build(creep);
        } else {
            RechargeCreep(creep);
        }
    }
};

module.exports = roleBuilder;

function setBuildingParameter(creep) {
    // Check Energy Capacity - if none, stop building and go harvest
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.building = false;
        creep.say('🔄 harvest');
    }
    // Reverse - if Energy Capacity is full, stop harvesting and go build
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
        creep.memory.building = true;
        creep.say('🚧 build');
    }
}

function Build(creep) {
    //Either Build if there are sites
    let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }

    //Or Reinforce Walls and Ramparts
    }else {
        Reinforce(creep)
    }
}

function Reinforce(creep){
    let defences= ROOM.find(FIND_STRUCTURES, {
        filter: structure => {
            return (structure.structureType === STRUCTURE_WALL
                    || structure.structureType === STRUCTURE_RAMPART)
                && structure.hits < 30000
        }
    });
    for(let structure of defences){
        creep.moveTo(structure);
        creep.repair(structure);
    }
}