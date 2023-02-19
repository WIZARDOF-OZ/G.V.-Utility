const {MessageEmbed} = require('discord.js');



module.exports = {
    name:"unlock",
    aliases: ['ul'],
    memberPermissions: ['MANAGE_CHANNELS'],
    category: "Moderation",
    
    execute: async(client, message, args, text , instance) => {

        const errEmbed = new MessageEmbed()

        let reason = args.slice(1).join(' ');


        if(!message.member.permissions.has('MANAGE_CHANNELS')) return channel.send(errEmbed.setDescription(`${instance.emoji.error} You Don't Have Perms To Use This Command`));

        let channeltolock = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        
        if(!channeltolock) return message.reply(errEmbed.setDescription(`${instance.emoji.error} Please Select One Channel To Unlock`))
        let everyone = message.guild.roles.cache.get(message.guild.id)
const unlockedembed = new MessageEmbed()
        .setTitle('Channel Unlocked Successfuly')
.setDescription(`Unlocked Channel: ${channeltolock} \n\n Reason: ${reason}`)
.setColor('RANDOM')
.setFooter(`Command used by ${message.author.tag}`,`${message.author.displayAvatarURL({dynamic: true})}`)
.setTimestamp()
        
        channeltolock.updateOverwrite(everyone, {
            
            SEND_MESSAGES: true,
            
        
        },[`REPONSIBLE MODERATOR | ${message.author.tag}`])
        .then(message.reply(unlockedembed))
        .catch(console.error);
    
    }
        }
    