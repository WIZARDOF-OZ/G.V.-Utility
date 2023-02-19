const Discord = require('discord.js');
const client = new Discord.Client()

module.exports = {
    name:"connect",
    aliases:["join"],
    description:"Join the voice channel",
    category:"Music",

    execute: async(client, message, args, text , instance) => {
        const success = new Discord.MessageEmbed()
        .setColor(instance.color.success)
        const errEmbed2 = new Discord.MessageEmbed()
        .setColor(instance.color.error)
const errEmbed1  = new Discord.MessageEmbed()
.setColor(instance.color.error)

        if(!message.member.voice.channel) return message.channel.send(errEmbed1.setDescription(`${instance.emoji.error}You must be in a voice channel to use this command.`));
        let permarry = message.guild.me.permissions.toArray()

        if(!permarry.includes('VIEW_CHANNEL')) return message.channel.send(errEmbed1.setDescription(`${instance.emoji.error}There  was an error  trying to  join your voice channel || Can't see your voice channel !`))
        if(!permarry.includes('VIEW_CHANNEL')) return message.send(errEmbed1.setDescription(`${instance.emoji.error}There  was an error  trying to  join your voice channel || Can't connect your voice channel !`))



try{
         message.member.voice.channel.join()

}
catch(err){
message.channel.send(errEmbed2.setDescription(`${instance.emoji.error}There  was an error  trying to  join your  voice channel || Make sure that i have proper permissions !`))
}
        if(message.guild.me.permissions.toArray().includes('ADD_REACTIONS')){
        
        try{     
            message.channel.send(success.setDescription(`${instance.emoji.success} Successfully join your voice channel`))    
       message.react('<:tick:846306021663703070>')
        }catch (e) {
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