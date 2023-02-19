const { message } = require("../../../../JSON/Club_Overview_Config.json");
const { MessageEmbed, Client } = require("discord.js");

/**
 * 
 * @param {Array} embeds 
 * @param {Client} client
 */

async function updateMessage(embeds, client) {
    message.forEach(async (data) => {
        const tchannel = await client.channels.cache.get(data.channelId);
        if (!tchannel) return;
        const tmsg = await tchannel.messages.fetch(data.messageId);
        if (!tmsg) return;
        const msgCollection = await tchannel.messages.fetch({ after: tmsg.id, limit: embeds.length - 1 });
        const msgArray = await msgCollection.array();
        const tmsgs = [tmsg, ...msgArray];
        embeds.forEach((_, i) => {
            if (tmsgs[i] && tmsgs[i].author.id == client.user.id) {
                tmsgs[i].edit(" ", embeds[i])
            }
            else {
                tchannel.send(embeds[i])
            }
        })
    });
}

module.exports = updateMessage;