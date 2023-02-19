const { Client, Message, MessageEmbed, Guild } = require('discord.js');
const {PREFIX , prefix} = require("../../../config.js")
module.exports = {
    name: 'announce',
    description: "Use to a important msg in embed to a specify channel",
    category: "Admin",
    aliases: ['announcement'],
    usage: '-announce #channel Hi -ping(for everyone ping)',
    memberPermissions: ['MANAGE_CHANNELS','ADMINISTATOR'],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    execute: async(client, message, args) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('You do not have permission to use this command');

        let mention;

        if(!args.length) return message.channel.send(`> Usage: ${prefix}announce <#channel> <message> <-ping ?>`);

        const channel = message.mentions.channels.first();
        if(!channel) return message.reply('Please specify a channel!');

        if(!args[1]) return message.reply('Please specify a message to announce');

        // mentions
        if(args.some((val) => val.toLowerCase() === '-ping')) {
            for (let i = 0; i < args.length; i++ ) {
                if(args[i].toLowerCase() === '-ping') args.splice(i, 1);
            }

            mention = true;
        } else mention = false;

        if(mention === true) channel.send('@everyone');

        channel.send(
            new MessageEmbed()
                .setAuthor(message.guild.iconURL())
                .setTitle(`Announcement`)
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()
                .setFooter(`Command is used by a staff member at`)
                .setColor('RANDOM')
        )


    }
}