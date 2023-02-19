const Discord = require('discord.js');

//const canvacord = require("canvacord");

module.exports = {
    name: "shit",
    category: "Images",

    execute: async(clinet, message, args) => {
        let target = message.mentions.users.first();
if(!target) return message.reply(`No User Mentioned !`)

const img = await canvacord.Canvas.shit(target.displayAvatarURL({ format: "png" }));

const attachment = new Discord.MessageAttachment(img, "shit.png");


let shitembed = new Discord.MessageEmbed()
.setTitle(`${target.tag} You shit`)
    .attachFiles([attachment])
    .setImage("attachment://shit.png")
    .setColor('RANDOM')
    .setFooter(`Oh Shit`)
    .setTimestamp()
    .setFooter(`REQUESTED BY ${message.author.tag}`,`${message.author.displayAvatarURL({dynamic:true})}`)
return message.channel.send(shitembed);

    }
}