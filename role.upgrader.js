let roleUpgrader = {
    run: function (creep) {
        console.log(`${creep.name} is upgrading.`);
        Upgrade(creep);
    }
};

module.exports = roleUpgrader;

function Upgrade(creep) {
    console.log(`${creep.name} is moving to upgrade controller.`);
    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
    creep.upgradeController(creep.room.controller);
}
