const Discord = require('discord.js')

module.exports = {

        name: "lockdown",
        category: 'Admin',
        description: "lockdown the  server",
        aliases: [],
    
    execute: async (client, message, args, text , instance) => {
        let lockPermErr = new Discord.MessageEmbed()
        .setTitle("**User Permission Error!**")
        .setDescription(`${instance.emoji.error}Sorry, you don't have permissions to use this command`)
        .setColor(instance.color.error)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`,`${message.author.displayAvatarURL({dynamic : true})} at`)
        
        if(!message.channel.permissionsFor(message.member).has("MANAGE_CHANNELS","ADMINISTRATOR") ) return message.channel.send(lockPermErr);
        
        if(!args[0]) {
        return message.channel.send("Please specify something.`Either on/off`")
        };

        const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');
        if (args[0] === 'on') {
            channels.forEach(channel => {
                channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: false
                })
            })
            
            let lockEmbed = new Discord.MessageEmbed()
                
                .setThumbnail(`https://media.giphy.com/media/JozO6wdFcC81VPO6RS/giphy.gif`)
                .setDescription(`**\n\nDone! Server Fully Locked! 🔒**`)
                .setColor('#2F3136')
            return message.channel.send(lockEmbed);

        } else if (args[0] === 'off') {
            channels.forEach(channel => {
                channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: true
                })
            })
            
            let lockEmbed2 = new Discord.MessageEmbed()
                .setColor('#2F3136')    
                .setThumbnail(`https://media.giphy.com/media/JozO6wdFcC81VPO6RS/giphy.gif`)
                .setDescription(`**\n\nDone! Server Fully Unlocked! 🔓**`)
            return message.channel.send(lockEmbed2)
        }
    }
}
