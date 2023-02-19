const { MessageEmbed , Client } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */
let Data = new Set();
module.exports = (client) => {
    
    client.on("message", (message) => {
        const { channel, guild, mentions, content, author } = message;
        if (channel.type !== "text") return;
        if (message.author.bot === true) return;
        const users = mentions.members.filter(m => m.user.bot === false).map(x => x);
        if (!users) return;
        else if (users.length === 0) return;
        Data.add(message.id);
        setTimeout(() => {
            Data.delete(message.id)
        }, 1000 * 60 * 2);
    });

    client.on("messageDelete", async(message) => {
        const { channel, guild, mentions, content, author } = message;
        if (channel.type !== "text") return;
        if (!Data.has(message.id)) return;
        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });
        const deletionLog = fetchedLogs.entries.first();
        const users = mentions.members.filter(m => m.user.bot === false).map(x => x.toString());

        const embed = new MessageEmbed()
            .setColor("RED")
            .setThumbnail("https://emoji.gg/assets/emoji/ping.png")
            .setTitle("Ghost Ping Detected!")
            .addField("Author", message.member, true)
            .addField("Mentions", users.join(" ") || "Not Found", true)
            .addField("Content", `${content || "Not Found"}`, false)
            .setFooter("Message Sent On")
            .setTimestamp(message.createdTimestamp);

            if(deletionLog){
                const { executor, target } = deletionLog;
                if (target.id === message.author.id) {
                    embed.addField("Deleted By" , `${executor || "NOT_FOUND"}` , false)
                }
            }
        channel.send(embed);
    })
}