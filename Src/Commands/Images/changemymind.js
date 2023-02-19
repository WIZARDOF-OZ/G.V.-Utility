const { MessageEmbed } = require('discord.js');
const Random = require("srod-v2");

module.exports = {

    name: 'changemymind',
    category: 'Images',
    description: 'Change your mind',
    usage: 'changemymind',
    aliases: [''],

    execute: async(bot, message, args, text, instance) => {

        const errEmbed = new MessageEmbed()
        .setColor(instance.color.error)
    
        let change = args[0];
    if (!change) return message.channel.send(errEmbed.setDescription(`${instance.emoji.error} Please Provide Some Text`));

    let data = await Random.ChangeMyMind({ Message: change });

    message.channel.send(data);
    }
};