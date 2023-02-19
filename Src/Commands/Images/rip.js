const Disocrd = require('discord.js');
const client = new Disocrd.Client();
//const canvacord = require("canvacord");

module.exports = {
    name: "rip",
    category: "Images",

    execute: async(client, message, args) => {
   /*     let target = message.mentions.users.first() ;
if(!target) return message.reply(`User Not Specified !`)

let avatar = target.displayAvatarURL({ dynamic: false, format: 'png', size: 512 });
let image = await canvacord.Canvas.rip(avatar);
let attachment = new Disocrd.MessageAttachment(image,"rip.png")
return message.channel.send(attachment);
*/
    }
}