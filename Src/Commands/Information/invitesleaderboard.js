const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "invites",
    aliases: ['invlb'],
    cooldown: 0,
    memberPermissions: [],
    category: "Information",
    /**
     *  
     * @param {Message} message 
     */
    execute: async (client, message, args, text, instance) => {
        const { guild } = message;
        let invites = await guild.fetchInvites();

        let info = [];
        invites.forEach((x) => {
            const { inviter, uses } = x;
            const find = info.find(x => x.id == inviter.id);
            if (!find) {
                info.push({
                    id: inviter.id,
                    uses: uses
                });
            }
            else if (find) {
                info = [...info.filter(x => x.id !== find.id), { id: find.id, uses: find.uses + uses }]
            }
        });
        info = info.filter(x => x.uses !== 0).sort((a , b) => b.uses - a.uses).map(x => `<@!${x.id}> has \`${x.uses}\` invites.`)
        info = splitArray(info, 20);
        const embeds = info.map((x) => {
            const embed = new MessageEmbed()
                .setTitle(`Invites Info | ${guild.name}`)
                .setDescription(x.join("\n"));
            return embed;
        })

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