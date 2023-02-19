const { MessageEmbed } = require('discord.js');
const translate = require('@vitalets/google-translate-api');

module.exports = {
    name: "translate",
    aliases: ['tl'],
    category: 'Information',
    cooldown: 0,
    memberPermissions: [],
    execute: async (client, message, args, text, instance) => {
        const { channel, author } = message;
        if (!args[0]) return channel.send(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} Please provide something to translate.`))

        try {
            const tls = await translate(text, { to: "en" });
            const embed = new MessageEmbed()
                .setColor("#4086F9")
                .setThumbnail("https://www.symbols.com/images/symbol/3029_google-translate.png")
                .setTitle(`Translation | From ${tls.from.language.iso || 'n/a'} -> en`)
                .addField('Input Text', text)
                .addField('Translated Text', tls.text || "No content")
                .setFooter(`Executed by: ${author.tag}`)
                .setTimestamp();
            channel.send(embed);
        } catch (e) {
            channel.send(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} An error occured while translating.`))
        }
    }
}