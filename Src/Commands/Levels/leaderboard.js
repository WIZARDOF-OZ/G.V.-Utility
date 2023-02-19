const { MessageEmbed } = require('discord.js');
const pagination = require('discord-paginationembed');
const levels = require('discord-xp');
const levelConfig = require("../../../JSON/Levelling_Config.json");

module.exports = {
    name: "leaderboard",
    aliases: ['lb'],
    category: "Levelling",
    cooldown: 5,
    memberPermissions: [],
    usage: 'No usage',
    description: 'Used to see the leaderboard.',
    execute: async (client, message, args, text, instance) => {
        const { member, guild, channel, mentions } = message;
        const guildConfig = levelConfig.find(x => x.guildId === guild.id);
        if (!guildConfig) return channel.send(new MessageEmbed().setColor(instance.color.error).setDescription(`<:crooss:846305904567517184> Levelling is disabled here.`));

        const rawLb = await levels.fetchLeaderboard(guild.id, 10000)
        const computeLb = await levels.computeLeaderboard(client, rawLb, false)
        const splitLb = splitArray(computeLb)

        let embeds = [];
        for (var i = 0; i < splitLb.length; i++) {
            const mapped = splitLb[i].map(e => {
                return `${e.position}. <@!${e.userID}> ${separate(e.xp)}xp lvl ${e.level}`;
            });
            const embed = new MessageEmbed()
                .setDescription(mapped.join("\n") || "No content")
                .setFooter(`Page: ${i + 1}/${splitLb.length}`)
                .setTimestamp();
            embeds.push(embed);
        }

        const pageEmbed = new pagination.Embeds()
            .setArray(embeds)
            .setAuthorizedUsers([message.author.id])
            .setChannel(channel)
            .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
            .setTitle("Levels Leaderboard")
            .setTimeout(1000 * 60 * 5)
            .setColor(7506394);

        await pageEmbed.build();
    }
}

function splitArray(array, chunks) {
    const inputArray = array;
    var perChunk = chunks || 10;
    var result = inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk)
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
        }
        resultArray[chunkIndex].push(item)
        return resultArray
    }, [])
    return result;
}
function separate(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}