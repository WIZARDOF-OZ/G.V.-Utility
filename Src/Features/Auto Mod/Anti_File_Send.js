const { Client, MessageEmbed } = require("discord.js");
const antiFileConfig = require("../../../JSON/Anti_File_Config.json");
/**
 * 
 * @param {Client} client 
 */

module.exports = (client, def) => {

    client.on("message", async (message) => {
        const { author, attachments, channel, guild, member } = message;
        if (!guild) return;
        if (author.bot) return;
        const guildConfig = antiFileConfig.find(x => x.guildId === guild.id);
        if (!guildConfig) return;
        if (guildConfig.whiteListedChannels.includes(channel.id)) return;
        if (!guildConfig.blackListedChannels.includes(channel.id)) return;
        if (!attachments.size > 0) return;
        if (member.permissions.toArray().find(x => guildConfig.ignoredPerms.includes(x))) return;

        const image = attachments.first().url;
        let blacklisted = [];
        guildConfig.fileType.forEach(type => {
            if (image.endsWith(type)) return blacklisted.push(type)
        });
        if (!blacklisted.length > 0) return;
        const warnEmbed = new MessageEmbed()
            .setColor(def.color.info)
            .setDescription(`${author.toString()} You are trying to upload \`${blacklisted[0]}\` file in ${channel}, which is not allowed.\n**Consider using the following channels to upload these files:**\n${guildConfig.whiteListedChannels.map(x => `**•** <#${x}>`).join("\n")}`)
        await message.inlineReply({
            embed: warnEmbed
        });
        await message.delete();
    });
}