const { MessageEmbed, Client } = require("discord.js");
const inviteConfig = require("../../../JSON/Anti_Invite_link_Config.json");
const discordInv = require('discord-inv');

/**
 * 
 * @param {Client} client 
 */

module.exports = (client, def) => {
    client.on("message", async (message) => {
        const { author, guild, content, channel } = message;
        if (author.bot) return;
        if (!guild) return;
        if (!content) return;
        const guildConfig = inviteConfig.find(x => x.guildId === guild.id);
        if (!guildConfig) return;
        if (guildConfig.ignoredChannels.includes(channel.id)) return;
        let missingPerms = [];
        guildConfig.ignoredPerms.forEach(perm => {
            if (message.member.hasPermission(perm)) return missingPerms.push(true)
        });
        if (missingPerms.includes(true)) return;

        const str = content;
        const regex = new RegExp('discord(?:\.com|app\.com|\.gg)[\/invite\/]?(?:[a-zA-Z0-9\-]{2,32})')
        const inviteUrl = regex.test(str) ? regex.exec(str) ? regex.exec(str)[0] : undefined : undefined
        if (!inviteUrl) return;

        try {
            const guildData = await discordInv.getInv(discordInv.getCodeFromUrl(inviteUrl))
            if (guildData.guild.id === guild.id) return;
            const embed = new MessageEmbed()
                .setColor(def.color.success)
                .setDescription(`${def.emoji.success} ${author}, Don't send invite links here.\nUse the following channels to send invite links:\n${guildConfig.ignoredChannels.map(x => `**•** <#${x}>`).join("\n")}`)
            await message.inlineReply({
                embed: embed,
            });
            if (guildConfig.delete) {
                message.delete();
            }

        } catch (e) { }
    });
}