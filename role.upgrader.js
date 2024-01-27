let roleUpgrader = {
    run: function (creep) {
        Upgrade(creep);
    }
};

module.exports = roleUpgrader;

function Upgrade(creep) {
    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
    creep.upgradeController(creep.room.controller);
}
