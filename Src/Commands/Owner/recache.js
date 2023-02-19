const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "recache",
    aliases: ["rc"],
    category:"BotDev",
    ownerOnly: true,
    execute: async (client, message, args, text, instance) => {
        await message.guild.members.fetch();
        await message.guild.roles.fetch();

        message.channel.send(new MessageEmbed().setDescription(`${instance.emoji.success} Done, re-cached members and roles.`).setColor(instance.color.success));
    }
}