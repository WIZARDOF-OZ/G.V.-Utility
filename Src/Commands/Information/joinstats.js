const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "joinstats",
    aliases: ["js", "joinstat"],
    cooldown: 0,
    category: "Information",
    memberPermissions: [],
    /**
     * 
     * @param {Message} message 
     */
    execute: async (client, message, args, text, instance) => {
        const { guild, author } = message;
        await guild.members.fetch();
        let mapped = guild.members.cache.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt))
        let i = 0;
        mapped = mapped.map((x) => {
            i++
            const num = i <= 9 ? `0${i}` : i;
            const content = `\`${num}.\` ${x.user.username} (${x.user.id})`;
            return content;
        });

        mapped = splitArray(mapped, 20);
        const embeds = mapped.map(x => {
            return new MessageEmbed().setDescription(x.join("\n"))
        }).map(x => x.setTitle(`Server Join Stats | ${guild.name}`))

        client.page(message, embeds)
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