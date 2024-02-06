require('ResourcesUtility');

let roleClaimer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        creep.memory.targetRoom='W59S5';
        if (creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(28, 14, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ffaa00'}});
        } else {
            if (!creep.room.controller.reservation) {
                let reservation = ReserveController(creep);
                if (reservation === 0) {
                    console.log("Controller in " + creep.memory.targetRoom + " Successfully Reserved",);
                    console.log(`Controller Status: ${Game.rooms['W59S5'].controller.reservation}`)
                }
            } else {
                ClaimController(creep);
            }
        }
    }
};

module.exports = roleClaimer;