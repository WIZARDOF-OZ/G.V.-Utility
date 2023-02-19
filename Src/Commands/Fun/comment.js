const Discord = require('discord.js');
const config = require('../../../config.js');
//const canvacord = require('canvacord');

module.exports = {
  
        name: 'comment',
        description: 'Shows your text as a Youtube Comment',
        aliases: ["comment"],
        usage: '<text>',
        category: 'Fun',
    
    execute: async (client, message, args,text, instance) => {
   /*    const errEmbed = new Discord.MessageEmbed()
        .setColor(instance.color.error)
        const comment = args.join('');
        if(!comment) return message.channel.send(errEmbed.setDescription(`${instance.emoji.error} Provide something to Comment!`))
        try {    
        let yt = await canvacord.Canvas.youtube({"avatar":message.author.displayAvatarURL({format: "png"}),"username":message.author.username, "content":args.join(" ")})
        let attachment = new Discord.MessageAttachment(yt, 'comment.png')
        message.channel.send(attachment);
    }catch(err) {
        const errEmbed2 = new Discord.MessageEmbed()
        .setColor(instance.color.error)
        const embed2 = new Discord.MessageEmbed()
    .setTitle(errEmbed2.setDescription(`${instance.color.error} Something went wrong.\n${instance.emoji.error}Note : It won't work if the User contains Unwanted characters in his Username.`))
    
    message.channel.send(embed2);
    
    }
*/
    }
};