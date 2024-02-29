require('ResourcesUtility');

let roleSupplier = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setSupplierParameters(creep)
        if (creep.memory.suppling) {
            if(creep.room.name==='W59S5'){
                let link=creep.room.storage.pos.findInRange(FIND_STRUCTURES,1,{
                    filter: structure=>structure.structureType===STRUCTURE_LINK
                });
                TransferEnergy(creep, link[0]);
            }else{
                TransferEnergy(creep, creep.room.storage);
            }
        } else {
            Salvage(creep);
            if(creep.room.name==='W59S5'){
                creep.moveTo(new RoomPosition(13,43,creep.room.name))
                WithdrawEnergy(creep, creep.room.storage);
            }else{
                creep.moveTo(new RoomPosition(24,20,creep.room.name))
                WithdrawEnergy(creep, Game.getObjectById('65c28768c5111521aad4be4d'));
            }

        }
    }
};

module.exports = roleSupplier;

function setSupplierParameters(creep) {
    // Check Energy Capacity - if none, stop supplying and go harvest
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

