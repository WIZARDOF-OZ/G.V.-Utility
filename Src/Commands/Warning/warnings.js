const { MessageEmbed, Message, Client } = require("discord.js")
const db = require("../../Database");
const warnConfig = require("../../../JSON/Warnings_Config.json");
const moment = require("moment");

module.exports = {
    name: 'warnings',
    aliases: ['warns'],
    category: "Warning",
    description: 'Used to check warns of a member.',
    usage: '[@member | id]',
    execute: async (client, message, args, text, instance) => {
        const { channel, member, guild, mentions } = message;
        const tuser = guild.members.cache.get(args[0]) || mentions.members.first() || member

        const fetchuser = await db.warnSchema.findOne({ id: tuser.user.id });
        const notFound = new MessageEmbed()
            .setColor(instance.color.error)
            .setDescription(`${instance.emoji.error} **${tuser.user.tag}** does not have any warns.`);
        if (!fetchuser) return channel.send(notFound);
        if (fetchuser.warnings.length === 0) return channel.send(notFound);

        let { warnings, lastUpdated } = fetchuser;
        warnings = splitArray(warnings, 15);

        let n = 1;
        warnings.forEach(warn => {
            const embed = new MessageEmbed()
                .setAuthor(tuser.user.tag, tuser.user.displayAvatarURL({ dynamic: true }))
                .setColor(7506394)
                .setTitle(`Total ${warnings.map(x => x.length).join(" + ")} Warnings`)
                .setTimestamp(lastUpdated)
                .setFooter("Last Warning On");
            warn.forEach((x) => {
                const responsible = client.users.cache.get(x.responsibleUser);
                embed.addField(`#${n++} | warn | ${moment(x.time).format("DD/MM/YYYY")}`, `Punishment-ID: ${x.id}\nResponsible-User: ${responsible ? responsible.tag : 'Not Found'}\nReason: ${reason(x.type, x.reason)}`, true)
            });
            channel.send(embed);
        });
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

function reason(type, reason) {
    if (type == 1) {
        return reason || "No Reason";
    }
    else if (type === 2) {
        return `AutoMod [BadWord]`
    }
    else if (type === 3) {
        return `AutoMod [Spam]`
    }
}