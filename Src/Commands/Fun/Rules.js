const Discord = require("discord.js")


module.exports = {
    name:"rules",
    category:"Admin",

    execute: (client, message, args) => {
        const rules = new Discord.MessageEmbed()
.setTitle(`SERVER RULES`)
        .setImage('https://cdn.discordapp.com/attachments/755671753547841627/852171739152908288/Rules.jpg')
        .setColor(`RANDOM`)
        .setTimestamp()
.setThumbnail(message.guild.iconURL({dynamic:true}))
.addField(`1`, "We expect all of our members to be respectful to everyone on this server. Joking is okay, but do not cross the line between joking and harrassing.Be respectful towards fellow members and staff.")
.addField(`2`, "Inappropriate content, especially nudity is completely unacceptable.If We Found Any NSFW Content Our Moderator Will Directly Kick Or Ban The Member From The Server Without Any Warning")
.setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
        message.channel.send(rules)
    }
}
