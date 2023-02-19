const { MessageEmbed, Client, Message } = require("discord.js");
const config = require("../../../JSON/Modmail_Config.json");

/**
 * 
 * @param {Client} client 
 */

module.exports = (client, def) => {

    client.on("message", async (message) => {
        const { channel, author, guild, content } = message;
        if (author.bot) return;
        if (channel.type !== "text") return;
        if (!guild) return;
        if (config.channelCategory !== channel.parentID) return;

        const tUser = client.users.cache.get(channel.name);
        if (!tUser) return;
        if (content === "-close") {
            const bye = new MessageEmbed()
                .setAuthor(' SUPPORT TEAM', config.icon)
                .addField('The support has been closed!', 'Message again to open a new support session.')
                .setFooter('Thank You for contacting us :)')
                .setColor('RED')
                .setTimestamp();
            tUser.send(bye).catch(e => {
                return message.channel.send(embed.setDescription('<:crooss:846305904567517184> | The user has blocked his dm\nMessage cannot be sent'))
            })
            channel.delete({ timeout: 5000 });
        }

        if (content.startsWith("-")) return;
        formEmbed(message).forEach(embed => {
            tUser.send(embed)
        });
        message.react("✅")
    })
}

function formEmbed(msg) {
    let embeds = [];
    const embed = new MessageEmbed()
        .setDescription(msg.content || "Attachment")
        .setAuthor(`${msg.author.tag}`,`${msg.author.displayAvatarURL({dynamic: true})}`)
        .setColor("GREEN")
        .setFooter(`SUPPORT TEAM`,msg.guild.iconURL({ dynamic: true }))
        .setTimestamp(msg.createdTimestamp);
    if (msg.attachments.array().length <= 1) {
        if (msg.attachments.array().length !== 0) embed.setImage(msg.attachments.first().proxyURL);
        embeds.push(embed)
    }
    if (msg.attachments.array().length > 1) {
        msg.attachments.array().forEach(atch => {
            const embed2 = new MessageEmbed()
                .setAuthor(`${msg.author.tag}`,`${msg.author.displayAvatarURL({dynamic: true})}` )
                
                .setColor("GREEN")
                .setFooter(`SUPPORT TEAM`,msg.guild.iconURL({ dynamic: true }))
                .setTimestamp(msg.createdTimestamp)
                .setImage(atch.proxyURL);
            embeds.push(embed2)
        });
    }
    return embeds;
}