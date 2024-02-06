require('ResourcesUtility');
require('Utils');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        setBuildingParameter(creep)

        //
        // // Assuming you have an array of room names
        // let roomNames = ['W59S4', 'W59S5'];
        //
        // // Loop through each room name
        // for (let i = 0; i < roomNames.length; i++) {
        //     let room = Game.rooms[roomNames[i]];
        //
        //     // Check if the room exists and if you have visibility in that room
        //     if (room && room.controller && room.controller.my) {
        //         // Get all construction sites in the room
        //         let constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        //
        //         // Process the construction sites
        //         for (let j = 0; j < constructionSites.length; j++) {
        //             Memory.constructionSites = constructionSites[j];
        //
        //             // Do something with the construction site
        //             console.log(`Construction site in ${room.name}: ${Memory.constructionSites.structureType}`);
        //         }
        //     }
        // }



        let constructions = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (creep.memory.building) {
            if (constructions.length > 0) {
                Build(creep, constructions);
            } else {
                Reinforce(creep)
            }
        } else {
            WithdrawEnergy(creep, ROOM.storage);
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