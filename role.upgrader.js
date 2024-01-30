let roleUpgrader = {
    run: function (creep) {
        if(creep.store[RESOURCE_ENERGY]>0){
            Upgrade(creep);
        } else{
            WithdrawEnergy(creep, Game.getObjectById(CONTROLLER_ENERGY_CONTAINER_I));
        }
    }
};

module.exports = roleUpgrader;

function Upgrade(creep) {
    if(creep.upgradeController(creep.room.controller)===ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}