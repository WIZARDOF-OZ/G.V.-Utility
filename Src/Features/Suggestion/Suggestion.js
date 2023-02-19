const { Client, MessageEmbed } = require("discord.js");
const suggestConfig = require("../../../JSON/Suggestion_Config.json");

/**
 * 
 * @param {Client} client 
 */

module.exports = (client) => {
    client.on('messageReactionAdd', async (messageReaction, user) => {
        if (user.bot) return;
        const { message: partialMsg, emoji } = messageReaction;
        const guildConfig = suggestConfig.find(x => x.guildId === partialMsg.guild.id);
        if (!guildConfig) return;
        if (!["👍", "👎", "🤷"].includes(emoji.name)) return;
        const message = await partialMsg.channel.messages.fetch(partialMsg.id)
        if (guildConfig.channelId !== message.channel.id) return;
        if (message.author.id !== client.user.id) return;
        if (!message.embeds.length > 0) return;
        if (!message.embeds[0].author) return;
        if (!message.embeds[0].author.name) return;
        if (!message.embeds[0].author.name.startsWith('Suggestion from')) return;

        const reactions = message.reactions.cache.array();
        let allusers = [];
        for (var index = 0; index < reactions.length; index++) {
            const x = reactions[index];
            if (x.emoji.name !== emoji.name) {
                const AlluserMap = await x.users.fetch();
                const AlluserArray = AlluserMap.array();
                allusers.push(...AlluserArray.map(x => x.id))
            }
        }
        if (allusers.includes(user.id)) return messageReaction.users.remove(user.id);

        const upvotes = await fetchVotes(message, '👍');
        const downvotes = await fetchVotes(message, '👎');

        const info = getInfo(upvotes, downvotes, guildConfig.config);
        const tembed = message.embeds[0];
        const embed = new MessageEmbed()
            .setAuthor(tembed.author.name, tembed.author.proxyIconURL || null)
            .setThumbnail(tembed.thumbnail.proxyURL || null)
            .setColor(info.color)
            .setDescription(tembed.description || "No Description")
            .addFields({
                name: `Votes`,
                value: `**Opinion**: ${upvotes - downvotes}\n**Upvotes**: ${upvotes}\n**Downvotes**: ${downvotes}`
            })
            .setFooter(`Status: ${info.status} | Submitted At`)
            .setTimestamp(tembed.timestamp)
        message.edit(embed);
    });

    client.on('messageReactionRemove', async (messageReaction, user) => {
        if (user.bot) return;
        const { message: partialMsg, emoji } = messageReaction;
        const guildConfig = suggestConfig.find(x => x.guildId === partialMsg.guild.id);
        if (!guildConfig) return;
        if (!["👍", "👎", "🤷"].includes(emoji.name)) return;
        const message = await partialMsg.channel.messages.fetch(partialMsg.id)
        if (guildConfig.channelId !== message.channel.id) return;
        if (message.author.id !== client.user.id) return;
        if (!message.embeds.length > 0) return;
        if (!message.embeds[0].author) return;
        if (!message.embeds[0].author.name) return;
        if (!message.embeds[0].author.name.startsWith('Suggestion from')) return;

        const reactions = message.reactions.cache.array();
        let allusers = [];
        for (var index = 0; index < reactions.length; index++) {
            const x = reactions[index];
            if (x.emoji.name !== emoji.name) {
                const AlluserMap = await x.users.fetch();
                const AlluserArray = AlluserMap.array();
                allusers.push(...AlluserArray.map(x => x.id))
            }
        }
        if (allusers.includes(user.id)) return messageReaction.users.remove(user.id);

        const upvotes = await fetchVotes(message, '👍');
        const downvotes = await fetchVotes(message, '👎');

        const info = getInfo(upvotes, downvotes, guildConfig.config);
        const tembed = message.embeds[0];
        const embed = new MessageEmbed()
            .setAuthor(tembed.author.name, tembed.author.proxyIconURL || null)
            .setThumbnail(tembed.thumbnail.proxyIconURL || null)
            .setColor(info.color)
            .setDescription(tembed.description || "No Description")
            .addFields({
                name: `Votes`,
                value: `**Opinion**: ${upvotes - downvotes}\n**Upvotes**: ${upvotes}\n**Downvotes**: ${downvotes}`
            })
            .setFooter(`Status: ${info.status} | Submitted at`)
            .setTimestamp(tembed.timestamp)
        message.edit(embed);
    });

    async function fetchVotes(message, emoji) {
        message.react(emoji)
        let returnVotes = 0;
        const getEmoji = message.reactions.cache.find(r => r.emoji.name === emoji);
        if (getEmoji) {
            const users = await getEmoji.users.fetch();
            const filtered = users.filter(x => x.id !== client.user.id);
            returnVotes = filtered.size || 0;
        }
        return returnVotes;
    }
}

function getInfo(upvotes, downvotes, guildConfig) {
    const opinion = upvotes - downvotes;
    let out = { color: '#7289DA', status: 'Waiting' }
    if (opinion >= guildConfig.accept) out = { color: 'GREEN', status: 'Liked' };
    if (opinion <= guildConfig.deny) out = { color: 'RED', status: 'Disliked' };
    return out;
}