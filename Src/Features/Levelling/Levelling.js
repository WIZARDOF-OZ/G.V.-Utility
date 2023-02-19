const { MessageEmbed, Client, MessageAttachment } = require("discord.js");
const fetch = require("node-fetch");
const qs = require("querystringify");
const levels = require("discord-xp");
const levelConfig = require("../../../JSON/Levelling_Config.json");
levels.setURL(require("../../../config").mongoDB);

/**
 * 
 * @param {Client} client 
 */

module.exports = async (client, def) => {

    client.on("message", async (message) => {
        const { author, guild, channel, member } = message;
        if (author.bot) return;
        if (!guild) return;
        const guildConfig = levelConfig.find(x => x.guildId === guild.id);
        if (!guildConfig) return;
        if (guildConfig.ignoreChannel.includes(channel.id)) return;
        const levelsChannel = await guild.channels.cache.get(guildConfig.levelsChannel);

        const hasLeveledUp = await levels.appendXp(message.author.id, message.guild.id, randomXP());
        if (!hasLeveledUp) return;

        const user = await levels.fetch(author.id, guild.id);
        const guildLb = await levels.fetchLeaderboard(guild.id, 10000);
        const computedLb = await levels.computeLeaderboard(client, guildLb, true);
        const rank = computedLb.find(x => x.userID === author.id);

        const rankCard = await makeCard({
            avatar: author.displayAvatarURL({ format: "png" }),
            currentXP: user.xp,
            requiredXP: levels.xpFor(user.level + 1),
            status: author.presence.status || "online",
            username: author.username,
            discriminator: author.discriminator.replace("#", ""),
            rank: rank.position,
            level: user.level,
        });

        const levelsEmbed = new MessageEmbed()
            .setColor(member.displayColor)
            .setAuthor(member.displayName, author.displayAvatarURL({ dynamic: true }))
            .setTitle(`<a:WumpusHappy:823975932158148669> Congratulations <a:WumpusHappy:823975932158148669>`)
            .setDescription(`You are now level **${user.level}**!!!`)
            .setFooter(guild.name)
            .setTimestamp();

        if (rankCard.buf) {
            const atch = new MessageAttachment(rankCard.buf, 'rank.png')
            levelsEmbed.attachFiles(atch)
            levelsEmbed.setImage(`attachment://rank.png`);
        }

        if (levelsChannel) {
            levelsChannel.send(author.toString(), levelsEmbed);
        }
        else {
            channel.send(author.toString(), levelsEmbed);
        }
    });
}

function randomXP() {
    const min = 1;
    const max = 30;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function makeCard(obj) {
    const endpoint = "https://TKE-GENERAL.screeneros.repl.co/api/rank";
    const data = qs.stringify({
        avatar: obj.avatar,
        currentXP: obj.currentXP,
        requiredXP: obj.requiredXP,
        status: obj.status,
        username: obj.username,
        discriminator: obj.discriminator,
        rank: obj.rank,
        level: obj.level,
        token: "TKE"
    }, true)

    const res = await fetch(`${endpoint}${data}`)
    try {
        const json = await res.json();
        if (json.data) return {
            status: false,
            buf: Buffer(json.data)
        }
        else {
            return {
                status: false
            }
        }
    } catch (e) {
        return {
            status: false
        }
    }
}