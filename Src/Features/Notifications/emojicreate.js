const Discord = require("discord.js");
const Client = new Discord.Client();

const config = require("../../../JSON/emojiCreate_Config.json");

const fetch = require("node-fetch");

/**
 * 
 * @param {Client} client
 * @param {Emoji} emoji
 */

module.exports = (client) =>{
    client.on("emojiCreate", function (emoji) {
        const channel = client.channels.cache.get('838362699326947328');
        channel.send( `Custom EMOJI Created: ${emoji}\nEMOJINAME: ${emoji.name}\nEMOJIID: ${emoji.id}\nEMOJIURL: ${emoji.url}`,
        )
      });
}
