const { Client, MessageEmbed } = require("discord.js");
const spamConfig = require("../../../JSON/Anti_Spam_Config.json");

/**
 * 
 * @param {Client} client 
 */

const usersMap = new Map();
module.exports = (client, def) => {

    const embed = new MessageEmbed()
        .setColor(def.color.success);

    client.on("message", async (message) => {
        const { guild, author } = message;
        if (author.bot) return;
        if (!guild) return;
        if (!spamConfig.guild.includes(guild.id)) return;
        if (spamConfig.ignoredUsers.includes(author.id)) return;
        let missingPerms = [];
        spamConfig.exemptPermissions.forEach(perm => {
            if (message.member.hasPermission(perm)) return missingPerms.push(true)
        });
        if(missingPerms.includes(true))return;
       
        const LIMIT = spamConfig.msgLimit;
        const TIME = spamConfig.deleteTime;
        const DIFF = spamConfig.msgDiff;
        const ROLE = spamConfig.muteRoleId;

        if (usersMap.has(message.author.id)) {
            const userData = usersMap.get(message.author.id);
            const { lastMessage, timer } = userData;
            const difference = message.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount;
             console.log(difference); 
            if (difference > DIFF) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.lastMessage = message;
                userData.timer = setTimeout(() => {
                    usersMap.delete(message.author.id);
                }, TIME);
                usersMap.set(message.author.id, userData);
            }
            else {
                ++msgCount;
                let msg;
                if (parseInt(msgCount) === LIMIT) {
                    const role = message.guild.roles.cache.get(ROLE);
                    if (role) {
                        message.member.roles.add(role);
                        msg = await message.channel.send(embed.setDescription(`${def.emoji.success} ${author} has been muted for spamming.`));
                    }
                    else {
                        message.channel.send(embed.setDescription(`${def.emoji.success} ${author} has been warned for spamming.`));
                    }
                    setTimeout(() => {
                        message.member.roles.remove(role);
                        message.channel.send(embed.setDescription(`${def.emoji.success} ${author} has been unmuted.\n[\`[Mute Message]\`](${message.url})`));
                    }, TIME);
                } else {
                    userData.msgCount = msgCount;
                    usersMap.set(message.author.id, userData);
                }
            }
        }
        else {
            let fn = setTimeout(() => {
                usersMap.delete(message.author.id);
            }, TIME);
            usersMap.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: fn
            });
        }
    });
}