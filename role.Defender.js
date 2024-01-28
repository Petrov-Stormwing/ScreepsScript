
const roleDefender = {
    /** @param {Creep} creep **/
    run: function (creep) {
        // Check for hostile creeps in the room
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0) {
            console.log(hostiles.length)
            // Attack the nearest hostile creep
            if (creep.attack(hostiles[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostiles[0], { visualizePathStyle: { stroke: '#ff0000' } });
            }
        } else {
            // If no hostiles are present, patrol the room or guard a specific location
            const patrolPoints = [
                new RoomPosition(25, 25, creep.room.name),
                // Add more patrol points as needed
            ];

            // Move to the next patrol point
            const nextPatrolPoint = patrolPoints[0]; // You can implement logic to choose the next point
            if (creep.pos.isEqualTo(nextPatrolPoint)) {
                // If already at the patrol point, remove it from the list
                patrolPoints.shift();
            } else {
                creep.moveTo(nextPatrolPoint, { visualizePathStyle: { stroke: '#00ff00' } });
            }
        }
    },
};

module.exports = roleDefender;
