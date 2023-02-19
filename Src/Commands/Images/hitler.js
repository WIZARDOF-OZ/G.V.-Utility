const Discord = require('discord.js');
const client = new Discord.Client();
//const canvacord = require("canvacord");



module.exports = {
    name:"hitler",
    aliases: [],
    memberPermissions: [],
    category: "Images",

    execute: async(client, message, args) => {
        
   /*     let target = message.mentions.users.first() ;
if(!target) return message.reply(`User Not Specified !`)

let avatar = target.displayAvatarURL({ dynamic: false, format: 'png', size: 512 });
let image = await canvacord.Canvas.hitler(avatar);
let attachment = new Discord.MessageAttachment(image, "hitler.png");
return message.channel.send(attachment);
*/
    }
}
