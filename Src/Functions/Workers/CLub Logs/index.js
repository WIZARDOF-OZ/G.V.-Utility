const clubLogs = require("./clubLogs");
const mongoose = require("mongoose");
const config = require("../../../../JSON/Club_Logs_Config.json");
const dbConfig = require("../../../../JSON/DataBase_Config.json");
const db = mongoose.model('database');

async function run(client) {
    const channel = await client.channels.cache.get(config.channel);
    if (!channel) return console.log("ClubLogs > No log channel found")
    let clubs = await db.findById(dbConfig.Club_Overview);
    if (!clubs) return console.log("ClubLogs > No clubs found")
    clubs = clubs.officialClubs;
    if (!clubs.length > 0) return console.log("ClubLogs > No clubs found")
    clubLogs(clubs.map(x => x.tag), channel, config.checkEvery) //clubs.map(x => x.tag)
}

module.exports = run;