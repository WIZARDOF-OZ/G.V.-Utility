const Discord = require("discord.js");
const db = require("old-wio.db");

const { support }  = require("../../../JSON/Invite_Config.json")

module.exports = {

  name: "invite",
  aliases: ["invitelink"],
  category: "BotDev",
  description: "Give You My Invite Link",
  usage: "invite",
  ownerOnly: true,
 
  execute: async (client, message, args) => {
    
    const Invite = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`, Owne = `Wizard`, Dev = `Wizard`;
    
    const Embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Thanks for using the bot")
    .addField("Invite Me", `[Click Me](${Invite})`, true)
    .addField("Support Server", `[Click Me](${support})`, true)
    .addField("Owner", Owne, true)
    .addField("Dev", Dev, true)
    .setFooter(`Requested by ${message.author.username}`)
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("Invite Link - " + Invite));
  }
};