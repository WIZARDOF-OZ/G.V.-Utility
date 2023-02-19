const Discord = require('discord.js');
const client = new Discord.Client()

module.exports = {
    name:"disconnect",
    aliases:["leave","dc"],
    description:"Leave the voice channel",
    category:"Music",

    execute: async(client, message, args, text, instance) => {
        const success = new Discord.MessageEmbed()
        .setColor(instance.color.success)
        const errEmbed1  = new Discord.MessageEmbed()
        .setColor(instance.color.error)
        
                if(!message.member.voice.channel) return message.channel.send(errEmbed1.setDescription(`${instance.emoji.error}You must be in a voice channel to use this command.`));


        await message.member.voice.channel.leave()


        if(message.guild.me.permissions.toArray().includes('ADD_REACTIONS')){

            try{
                message.channel.send(success.setDescription(`${instance.emoji.success} Successfully leave your voice channel`))    
                message.react('<:tick:846306021663703070>')
            }
            catch (e) {
                console.log(e)
                message.channel.send(new MessageEmbed()
                .setColor(`RED`)
                .setFooter(`ONE ERROR OCCURED AT`)
                .setTimestamp()
                .setTitle(`❌ ERROR | An error occurred`)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
              );
              };
        }
    }
}