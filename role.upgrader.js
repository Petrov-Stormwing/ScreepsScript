let roleUpgrader = {
    run: function (creep) {
        if(creep.store[RESOURCE_ENERGY]>0){
            Upgrade(creep);
        } else{
            WithdrawEnergy(creep, ROOM.storage);
        }
    }
};

module.exports = roleUpgrader;