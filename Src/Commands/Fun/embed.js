const { MessageEmbed } = require('discord.js');


module.exports = {

    name: 'embed',
    category: 'Fun',


    execute: async(client, message, args, text, instance) => {
try{
      const errembed = new MessageEmbed()
      .setColor(instance.color.error)
 if(!args[0]) await message.inlineReply(errembed.setDescription(`${instance.emoji.error} Please Provide Some Text`))

 else {
     const embed = new MessageEmbed()
     .setDescription(message.content.substring(6))
     .setTimestamp()
     .setColor("RANDOM")
     message.channel.send(embed)
 }
}catch (e) {
    console.log(e)
    message.channel.send(e)
}

   
    }
};