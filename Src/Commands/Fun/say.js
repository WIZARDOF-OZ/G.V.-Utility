const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "say",
  category: "Fun",
  cooldown: 2,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute: async (client, message, args, text, instance) => {
      const errEmbed = new MessageEmbed()
      .setColor(instance.color.error)
      try{
    if(!args[0]) return message.channel.send(errEmbed.setDescription(`${instance.emoji.error}Please provide some text`))
    const sayEmbed = new MessageEmbed()

        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dyanmic: true }))
        .setDescription(args.join(" "))
      
        .setTimestamp()
        .setColor("RANDOM")

    message.channel.send(sayEmbed)
  }catch (e) {
    return message.channel.send(e)
}
}
};