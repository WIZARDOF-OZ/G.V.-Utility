const Discord = require('discord.js');
const client = new Discord.Client();
//const canvacord = require("canvacord");



module.exports = {
    name:"trigger",
    aliases: [],
    memberPermissions: [],
    category: "Images",

    execute: async(client, message, args) => {
        
 /*       let target = message.mentions.users.first() ;
if(!target) return message.reply(`User Not Specified !`)

let avatar = target.displayAvatarURL({ dynamic: false, format: 'png', size: 512 });
let image = await canvacord.Canvas.trigger(avatar);
let attachment = new Discord.MessageAttachment(image, "trigger.gif");
return message.channel.send(attachment);
*/
    }
}
