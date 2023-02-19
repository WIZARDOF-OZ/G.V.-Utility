const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "gend",
    aliases: ['giveawayend'],
    category: "Giveaway",
    cooldown: 0,
    usage: "<msgId>",
    memberPermissions: ['MANAGE_GUILD'],
    execute: async (client, message, args, text, instance) => {
        const { author, member, mentions, channel } = message;
        if (!args[0]) return channel.send(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} Please provide the message id of the giveaway.`))
        const ended = await client.giveaways.endGiveaway(args[0]);

        if (!ended) {
            return channel.send(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} The giveaway id is invalid or the giveaway has ended.`));
        }
        else {
            return channel.send(new MessageEmbed().setColor(instance.color.success).setDescription(`${instance.emoji.success} Ended the giveaway.`));
        }
    }
}