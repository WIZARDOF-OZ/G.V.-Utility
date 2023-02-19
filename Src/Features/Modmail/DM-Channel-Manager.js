const { MessageEmbed, Client, Message } = require("discord.js");
const config = require("../../../JSON/Modmail_Config.json");

/**
 * 
 * @param {Client} client 
 */

module.exports = (client, def) => {

    client.on("message", async (message) => {
        const { channel, author } = message;
        if (author.bot) return;
        if (channel.type !== "dm") return;

        const bluChannel = await client.channels.cache.get(config.blockedUsersChannelId);
        const bluMsg = await bluChannel.messages.fetch();
        const blockUsers = bluMsg.map(x => x.content);

        if (blockUsers.includes(author.id)) {
            let blocked = new MessageEmbed()
                .setColor('RED')
                .setAuthor('SUPPORT TEAM', config.icon)
                .addField('<a:animated_redCheck:770612028321562624> | You have been blocked by our Support Team', 'To get yourself unblocked please contact Mod/Staff members.');
            author.send(blocked);
            return;
        }

        const userChannel = await checkChannel(author.id);
        if (!userChannel) {
            const category = await client.channels.cache.get(config.channelCategory);
            const newUserChannel = await category.guild.channels.create(author.id, {
                parent: category.id
            });

            let welcome = new MessageEmbed()
                .setColor('BLUE')
                .setAuthor('SUPPORT TEAM', config.icon)
                .addField('<:tick:846306021663703070> | Thank You for contacting the support', 'The support team will get back to you as soon as possible');
            message.author.send(welcome);

            const userInfoEmbed = new MessageEmbed()
                .setColor(def.color.info)
                .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                .setAuthor(`${author.tag} (${author.id})`, author.displayAvatarURL({ dynamic: true }))
                .addField("Mutual Servers", client.guilds.cache.filter(x => x.members.cache.get(author.id)).map(x => `**•** ${x.name}`).join("\n"))
                .addField("Created At", author.createdAt)
                .setFooter(`${author.tag}`)
                .setTimestamp();
            const m = await newUserChannel.send(config.rolePing.map(x => `<@&${x}>`).join(", ") , userInfoEmbed);
            await m.pin();
            await formEmbed(message).forEach(embed => {
                newUserChannel.send(embed)
            });
        }
        if (userChannel) {
            formEmbed(message).forEach(embed => {
                userChannel.send(embed)
            });
        }
        message.react("✅")
    });

    async function checkChannel(id) {
        const category = await client.channels.cache.get(config.channelCategory);
        if (!category) return undefined;
        const tchannel = await category.children.find(x => x.name === id);
        if (!tchannel) return undefined;
        return tchannel;
    }
    /**
     * 
     * @param {Message} msg 
     */

    function formEmbed(msg) {
        let embeds = [];
        const embed = new MessageEmbed()
            .setDescription(msg.content || "Attachment")
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
            .setColor("RED")
            .setFooter(msg.author.id)
            .setTimestamp(msg.createdTimestamp);
        if (msg.attachments.array().length <= 1) {
            if (msg.attachments.array().length !== 0) embed.setImage(msg.attachments.first().proxyURL);
            embeds.push(embed)
        }
        if (msg.attachments.array().length > 1) {
            msg.attachments.array().forEach(atch => {
                const embed2 = new MessageEmbed()
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
                    .setColor("RED")
                    .setFooter(msg.author.id)
                    .setTimestamp(msg.createdTimestamp)
                    .setImage(atch.proxyURL);
                embeds.push(embed2)
            });
        }
        return embeds;
    }
}