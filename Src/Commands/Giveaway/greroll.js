const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "greroll",
    aliases: ['giveawayreroll'],
    cooldown: 0,
    category: "Giveaway",
    usage: "<msgId>",
    memberPermissions: ['MANAGE_GUILD'],
    execute: async (client, message, args, text, instance) => {
        const { author, member, mentions, channel } = message;
        if (!args[0]) return channel.send(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} Please provide the message id of the giveaway.`))
        const reroll = await client.giveaways.rerollGiveaway(args[0]);

        if (!reroll) {
            return channel.send(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} The giveaway id is invalid or the giveaway hasn't ended.`));
        }
        else {
            return channel.send(new MessageEmbed().setColor(instance.color.success).setDescription(`${instance.emoji.success} Rerolled the giveaway.`));
        }
    }
}