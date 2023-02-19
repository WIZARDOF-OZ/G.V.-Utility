const { MessageEmbed } = require('discord.js');
const wiki = require("wikipedia");

module.exports = {
    name: "wikipedia",
    aliases: ['wiki'],
    category: 'Information',
    cooldown: 0,
    memberPermissions: [],
    execute: async (client, message, args, text, instance) => {
        const { channel, author } = message;
        if (!args[0]) return channel.send(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} Please provide something to translate.`))
        const msg = await channel.send(new MessageEmbed().setDescription(`${instance.emoji.loading} Searching wikipedia, please wait.`));
        try {
            const page = await wiki.default(text);
            const summary = await page.summary();

            const embed = new MessageEmbed()
                .setTitle(`Wikipedia | ${summary.title}`)
                .setThumbnail(summary.thumbnail.source)
                .setColor("GREY")
            if (summary.extract.length > 1000) {
                const ext = summary.extract.slice(1000, summary.extract.length) + " ....";
                embed.setDescription(ext);
            }
            else {
                embed.setDescription(summary.extract || "No Information")
            }
            msg.edit(embed)
        } catch (e) {
            msg.edit(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} An error occured while searching wikipedia.`))
        }
    }
}