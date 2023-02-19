const config = require("../../../config");
const { GiveawayCreator } = require('discord-giveaway');

function giveaways(client) {
    const Creator = new GiveawayCreator(client, config.mongoDB);
   return client.giveaways = Creator;
}
module.exports = giveaways;