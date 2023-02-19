const db = require("old-wio.db");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  
  name: "howgay",
  aliases: ["hg"],
  category: "Fun",
  description: "Shows How Member Gay Is!",
  usage: "howgay <Mention Member>",
  
  execute: async (client, message, args) => {
    //Start

    let Member =
      message.mentions.users.first() ||
      message.guild.member(args[0]) ||
      message.author;

    let Result = Math.floor(Math.random() * 101);

    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`About your Gayness`)
      .setDescription(`${Member.username} Is ${Result}% Gay 🏳️‍🌈`)
      .setFooter(`Requested by ${message.author.username}`)
      .setTimestamp();

    message.channel.send(embed);

    //End
  }
};
 
