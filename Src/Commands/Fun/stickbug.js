const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
    name: "stickbug",
    aliases: ["sb"],
    cooldown: 0,
    memberPermissions: [],
    category: "Fun",
    execute: async (client, message, args, text, instance) => {
        const tuser = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        message.react("791335463360135211")
        const embed = new MessageEmbed()
            .setDescription(`${instance.emoji.error} An unexpected error occured.`)
            .setColor(instance.color.error);
        try {
            const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=stickbug&url=${tuser.user.displayAvatarURL({
                format: 'png',
                dynamic: false,
                size: 1024
            })}`)).then(r => r.json())
            if (res.success !== true) return message.channel.send(embed);
            const vid = res.message;
            const attachment = new MessageAttachment(vid, `stickbug.mp4`);
            message.channel.send(attachment);
        } catch (e) {
            message.channel.send(embed);
            console.log(e)
        }
    }
}