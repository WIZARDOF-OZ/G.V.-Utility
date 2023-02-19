const { MessageEmbed } = require('discord.js');
const suggestConfig = require("../../../JSON/Suggestion_Config.json");

module.exports = {
    name: "suggestion",
    memberPermissions: ['ADMINISTRATOR'],
    descripton: "Used to accept or deny a suggestion.",
    usage: '<msgID> <accept | deny> [reason]',
    category: "Suggestion",
    execute: async (client, message, args, text, instance) => {

        const { channel, author, guild, mentions } = message;
        const { emoji, color } = instance;

        const guildConfig = suggestConfig.find(g => g.guildId === guild.id);
        const notFound = new MessageEmbed().setColor(color.error).setDescription(`${emoji.error} This server does not have suggestions setup.`);
        if (!guildConfig) return channel.send(notFound);

        const tchannel = await guild.channels.cache.get(guildConfig.channelId);
        if (!tchannel) return channel.send(notFound.setDescription(`${emoji.error} Suggestion channel not found.`));

        const suggestId = args[0];
        if (!suggestId) return channel.send(notFound.setDescription(`${emoji.error} Please provide the message id of the suggestion.`));

        switch (args[1] ? args[1].toLowerCase() : "undefined") {
            case "accept":
                const tmsg = await tchannel.messages.fetch(suggestId);
                if (!tmsg) return channel.send(notFound.setDescription(`${emoji.error} Unable to find the suggestion.`));
                if (tmsg.author.id !== client.user.id) return channel.send(notFound.setDescription(`${emoji.error} Unable to find the suggestion.`));
                if (!tmsg.embeds.length > 0) return channel.send(notFound.setDescription(`${emoji.error} Unable to find the suggestion.`));
                if (!tmsg.embeds[0].author.name.startsWith('Suggestion from')) return channel.send(notFound.setDescription(`${emoji.error} Unable to find the suggestion.`));

                const newEmbed = new MessageEmbed(tmsg.embeds[0])
                    .setAuthor(`Accepted ${tmsg.embeds[0].author.name}`, tmsg.embeds[0].author.proxyIconURL)
                    .addField(`Accepted by ${author.tag}`, args[2] ? text.replace(args[0], "").replace(args[1], "") : "No Reason Provided")
                    .setFooter("Accepted")
                    .setColor("GREEN")
                tmsg.edit(newEmbed);
                message.react(emoji.success)
                break;

            case "deny":
                const tmsg2 = await tchannel.messages.fetch(suggestId);
                if (!tmsg2) return channel.send(notFound.setDescription(`${emoji.error} Unable to find the suggestion.`));
                if (tmsg2.author.id !== client.user.id) return channel.send(notFound.setDescription(`${emoji.error} Unable to find the suggestion.`));
                if (!tmsg2.embeds.length > 0) return channel.send(notFound.setDescription(`${emoji.error} Unable to find the suggestion.`));
                if (!tmsg2.embeds[0].author.name.startsWith('Suggestion from')) return channel.send(notFound.setDescription(`${emoji.error} Unable to find the suggestion.`));

                const newEmbed2 = new MessageEmbed(tmsg2.embeds[0])
                    .setAuthor(`Denied ${tmsg2.embeds[0].author.name}`, tmsg2.embeds[0].author.proxyIconURL)
                    .addField(`Denied by ${author.tag}`, args[2] ? text.replace(args[0], "").replace(args[1], "") : "No Reason Provided")
                    .setFooter("Denied")
                    .setColor("RED")
                tmsg2.edit(newEmbed2);
                message.react(emoji.success)
                break;

            default:
                channel.send(notFound.setDescription(`${emoji.error} Usage: <msgID> <accept | deny> [reason]`))
                break;
        }
    }
}