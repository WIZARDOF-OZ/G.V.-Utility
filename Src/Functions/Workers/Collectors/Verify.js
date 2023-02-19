const { MessageCollector, MessageEmbed, Client } = require("discord.js");
const config = require("../../../../JSON/Verify_Config.json");

/**
 * 
 * @param {Client} client 
 */

async function verify(client) {
    config.forEach(async (data) => {
        const guild = await client.guilds.cache.get(data.guildId);
        if (!guild) return;
        const channel = await guild.channels.cache.get(data.channelId);
        if (!channel) return;
        console.log("Loaded")
        const filter = (m) => m.author.bot == false;
        const collector = new MessageCollector(channel, filter);
        collector.on("collect", async (message) => {
            if (message.author.bot !== false) return;
            const { content, member } = message;
            const check = data.keyWords.find(k => content.toLowerCase().match(k))

            if (check) {
                await data.rolesRemove.forEach(async (r) => {
                    const role = await guild.roles.cache.get(r);
                    if (role) member.roles.remove(role.id)
                });
                await data.rolesAdd.forEach(async (r) => {
                    const role = await guild.roles.cache.get(r);
                    if (role) member.roles.add(role.id)
                });
                message.delete();
            }
            else {
                const msg = await message.inlineReply(`Kindly follow the instructions :)`)
                await message.delete();
                msg.delete({ timeout: 1000 * 10 })
            }
        });
    });
}

module.exports = verify;