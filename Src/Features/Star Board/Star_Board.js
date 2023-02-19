const { MessageEmbed, Client, Message } = require("discord.js");
const config = require("../../../JSON/Star_Board_Config.json");

/**
 * 
 * @param {Client} client 
 *  
 */

module.exports = (client) => {

    client.on('messageReactionAdd', async (messageReaction, user) => {
        const { emoji, message: msgPartial } = messageReaction;
        if (user.bot) return;
        if (emoji.name !== '⭐') return;
        let message = await msgPartial.channel.messages.fetch(msgPartial.id);
        if (message.author.bot) return;
        const tmember = await message.guild.members.fetch(message.author.id);
        message.member = tmember;
        let tguild = config[message.guild.id];
        if (!tguild) return;
        const guild = await client.guilds.cache.get(message.guild.id);
        if (!guild) return;
        const channel = await guild.channels.cache.get(tguild.channel);
        if (!channel) return;

        const stars = (await message.reactions.cache.find(x => x.emoji.name === '⭐').users.fetch()).size || 0;
        if (stars < tguild.reactionLimit) return;

        const msgs = await channel.messages.fetch({ limit: 100 })
        if (msgs.size === 0) return;
        const msgsArray = msgs.array();
        const findMsg = msgsArray.filter(x => x.author.id === client.user.id).find(x => x.embeds[0] && x.embeds[0].footer && x.embeds[0].footer.text && x.embeds[0].footer.text === message.id)
        const msgEmbed = embed(message);
        if (findMsg) {
            const tmsg = await channel.messages.fetch(findMsg.id);
            if (tmsg) {
                tmsg.edit(`🌟 **${stars}** | ${message.channel.toString()}`, msgEmbed)
            }
        }
        else {
            channel.send(`🌟 **${stars}** | ${message.channel.toString()}`, msgEmbed)
        }
    });

    client.on('messageReactionRemove', async (messageReaction, user) => {
        const { emoji, message: msgPartial } = messageReaction;
        if (user.bot) return;
        if (emoji.name !== '⭐') return;
        let message = await msgPartial.channel.messages.fetch(msgPartial.id);
        if (message.author.bot) return;
        const tmember = await message.guild.members.fetch(message.author.id);
        message.member = tmember;
        let tguild = config[message.guild.id];
        if (!tguild) return;
        const guild = await client.guilds.cache.get(message.guild.id);
        if (!guild) return;
        const channel = await guild.channels.cache.get(tguild.channel);
        if (!channel) return;

        const starMsg = await message.reactions.cache.find(x => x.emoji.name === '⭐');
        const stars = starMsg ? starMsg.users ? starMsg.users.fetch().size : 0 : 0;

        const msgs = await channel.messages.fetch({ limit: 100 })
        if (msgs.size === 0) return;
        const msgsArray = msgs.array();
        const findMsg = msgsArray.filter(x => x.author.id === client.user.id).find(x => x.embeds[0] && x.embeds[0].footer && x.embeds[0].footer.text && x.embeds[0].footer.text === message.id)
        const msgEmbed = embed(message);
        if (findMsg) {
            const tmsg = await channel.messages.fetch(findMsg.id);
            if (tmsg) {
                tmsg.edit(`🌟 **${stars}** | ${message.channel.toString()}`, msgEmbed)
            }
        }
        else {
            if (stars === 0) return;
            channel.send(`🌟 **${stars}** | ${message.channel.toString()}`, msgEmbed)
        }
    });
}

/**
 * 
 * @param {Message} message 
 */

function embed(message) {
    const img = message.embeds.find(x => x.type === 'image') ? message.embeds.find(x => x.type === 'image').url : undefined || message.attachments.first() ? message.attachments.first().proxyURL : undefined;
    const embed = new MessageEmbed()
        .setAuthor(message.author.tag || "No", message.author.displayAvatarURL({ dynamic: true }))
        .setColor(message.member.displayColor)
        .setTimestamp(message.createdTimestamp)
        .setDescription(`${message.content || "No Content Provided"}\n\n**[Click to jump to message!](${message.url})**`)
        .setFooter(message.id)
    if (img) {
        embed.setImage(img)
    }
    return embed;
}