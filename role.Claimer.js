require('ResourcesUtility');

let roleClaimer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(28, 14, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ffaa00'}});
        } else {
            if (!creep.room.controller.reservation) {
                let reservation = reserveController(creep);
                if (reservation === 0)
                    console.log("Controller in " + creep.memory.targetRoom + " Successfully Reserved",);
                console.log(Game.rooms['W59S5'].controller.reservation)
            } else {
                claimController(creep);
            }
        }
    }
};

module.exports = roleClaimer;

/**
 * Function to reserve the controller. Required if Neutral
 * @param creep
 */
function reserveController(creep) {
    let controller = creep.room.controller;

    if (controller) {
        if (creep.pos.inRangeTo(controller, 1)) {
            // Reserve the controller
            let reserveResult = creep.reserveController(controller);
            console.log('Reserve Result:', reserveResult);
            return reserveResult;
        } else {
            // Move closer to the controller
            let moveResult = creep.moveTo(controller, {visualizePathStyle: {stroke: '#650a65'}});
            console.log('Move Result:', moveResult);
        }
    } else {
        // Handle the case when the controller is not present (optional)
        console.log("No controller found in the room.");
    }
}

/**
 * Function to Claim the controller.
 * @param creep
 */
function claimController(creep) {
    let controller = creep.room.controller;

    if (controller) {
        if (creep.pos.inRangeTo(controller, 1)) {
            // Claim the controller
            console.log("Claiming Controller: In Progress...")
            let result=creep.claimController(controller);
            console.log("Claiming Controller Result: " + result);
        } else {
            // Move closer to the controller
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#650a65'}});
        }
    } else {
        // Handle the case when the controller is not present (optional)
        console.log("No controller found in the room.");
    }
}