const { MessageEmbed , Message} = require('discord.js');

module.exports = {
    name: "roles",
    cooldown: 0,
    memberPermissions: ['MANAGE_GUILD'],
    description: "Shows all the roles of the server.",
    /**
     * 
     * @param {Message} message 
     */
    execute: async (client, message, args, text, instance) => {
        const { guild, channel } = message;
        await guild.members.fetch();
        await guild.roles.fetch();
        
        let roles = guild.roles.cache.sort((a , b) => b.position - a.position).map(r => `• ${r.toString()} [${r.members.size}]`);
        roles = splitChunk(roles , 30);

        const embed = new MessageEmbed()
        .setColor(instance.color.info)
        .setAuthor(guild.name , guild.iconURL({dynamic : true}))
        .setThumbnail(guild.iconURL({dynamic : true}))
        .setTitle(`Total ${guild.roles.cache.size} roles!`)
        roles.forEach(r => {
            embed.addField(`\u200b` , r.join("\n"))
        });    
        channel.send(embed)
    }
}

function splitChunk(array, chunk) {
    const inputArray = array;
    var perChunk = chunk || 15;
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