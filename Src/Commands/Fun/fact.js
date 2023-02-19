const { MessageEmbed } = require('discord.js');
const Random = require("srod-v2");

module.exports = {

    name: 'fact',
    category: 'Fun',
    description: 'Shows some cool fact',
    usage: 'fact',
    aliases: [''],

    execute: async(bot, message, args) => {
       let data = await Random.GetFact();
       message.channel.send(data);
    }
};