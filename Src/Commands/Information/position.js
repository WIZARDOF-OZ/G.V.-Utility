const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "position",
  category: "Information",
  aliases: ["memberposition","memberp"],

  /**
   * @param {Client} client
   * @param {Message} message
   */
  execute: async (client, message, args) => {
    const success = new MessageEmbed()
    .setColor("GREEN")
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) ||message.member;

    if (!member) return message.reply("Please specify a member!");

    const members = message.guild.members.cache
      .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
      .array();

    const position = new Promise((ful) => {
      for (let i = 1; i < members.length + 1; i++) {
        if (members[i - 1].id === member.id) ful(i);
      }
    });

    message.channel.send(success.setDescription(`${member} is the ${await position} member to join the server!`
    ));
  },
};