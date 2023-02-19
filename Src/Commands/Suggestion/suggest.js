const { MessageEmbed } = require("discord.js");
const suggestConfig = require("../../../JSON/Suggestion_Config.json");

module.exports = {
    name: 'suggest',
    description: 'Used to suggest something for the server.',
    usage: '<content>',
    category: "Suggestion",
    cooldown: 10,
    execute: async (client, message, args, text, instance) => {
        const { channel, author, guild, mentions } = message;
        const { emoji, color } = instance;

        const guildConfig = suggestConfig.find(g => g.guildId === guild.id);
        const notFound = new MessageEmbed().setColor(color.error).setDescription(`${emoji.error} This server does not have suggestions setup.`);
        if (!guildConfig) return channel.send(notFound);

        const tchannel = await guild.channels.cache.get(guildConfig.channelId);
        if (!tchannel) return channel.send(notFound.setDescription(`${emoji.error} Suggestion channel not found.`));

        if (!args[0]) return channel.send(notFound.setDescription(`${emoji.error} Please provide some content to suggest.`))

        const embed = new MessageEmbed()
            .setColor("#7289DA")
            .setAuthor(`Suggestion from ${author.tag}`, author.displayAvatarURL({ dynamic: true }))
            .setThumbnail(author.displayAvatarURL({ dynamic: true }))
            .setDescription(text)
            .setFooter("Status: Waiting | Submitted At")
            .setTimestamp(message.createdAtTimestamp);
        const msg = await tchannel.send(embed);
        await msg.react("👍");
        await msg.react("🤷");
        await msg.react("👎");

        const doneEmbed = new MessageEmbed()
        .setColor(color.success)
        .setDescription(`${emoji.success} [Suggestion](${msg.url}) sent to ${tchannel}`);
        channel.send(doneEmbed);
    }
}