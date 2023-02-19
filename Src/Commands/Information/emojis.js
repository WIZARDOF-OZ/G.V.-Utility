const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "emojis",
    aliases: [],
    cooldown: 0,
    memberPermissions: [],
    category: "Information",
    execute: async (client, message, args, text, instance) => {
        const emojis = message.guild.emojis.cache;
        let mapped = splitArray(emojis.map((e, i) => `${e.toString()} **|** \`${e.toString()}\``), 20);
        mapped = mapped.map(x => {
            const embed = new MessageEmbed()
                .setTitle(`Emoji Info - ${emojis.size} | ${message.guild.name}`)
                .setDescription(x.join("\n"));
                return embed;
        });

        client.page(message , mapped);
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