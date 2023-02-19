const { MessageEmbed, MessageAttachment } = require('discord.js');
const levels = require('discord-xp');
const qs = require("querystringify");
const fetch = require("node-fetch");
const levelConfig = require("../../../JSON/Levelling_Config.json");

module.exports = {
    name: "rank",
    aliases: ['level', 'lvl'],
    cooldown: 10,
    category: "Levelling",
    memberPermissions: [],
    usage: '[@mention | id]',
    description: 'Used to see the rank.',
    execute: async (client, message, args, text, instance) => {
        const { member, guild, channel, mentions } = message;
        const guildConfig = levelConfig.find(x => x.guildId === guild.id);
        if (!guildConfig) return channel.send(new MessageEmbed().setColor(instance.color.error).setDescription(`<:crooss:846305904567517184> Levelling is disabled here.`))
        const target = mentions.members.first() || guild.members.cache.get(args[0]) || member;
        const msg = await channel.send(new MessageEmbed().setDescription(`<:searching:846306228804124672> Making a rank card, please wait.`));

        const user = await levels.fetch(target.user.id, guild.id);
        if (!user) return msg.edit(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} ${target.toString()} haven't attained any xp yet!`))
        const guildLb = await levels.fetchLeaderboard(guild.id, 10000);
        const computedLb = await levels.computeLeaderboard(client, guildLb, true);
        const rank = computedLb.find(x => x.userID === target.user.id);

        const rankCard = await makeCard({
            avatar: target.user.displayAvatarURL({ format: "png" }),
            currentXP: user.xp,
            requiredXP: levels.xpFor(user.level + 1),
            status: target.user.presence.status || "online",
            username: target.user.username,
            discriminator: target.user.discriminator.replace("#", ""),
            rank: rank.position,
            level: user.level,
        });

        const embed = new MessageEmbed()
            .setColor()
            .setAuthor(`${target.user.tag}`, target.user.displayAvatarURL({ dynamic: true }))
            .setFooter(guild.name)
            .setTimestamp();

        if (rankCard.buf) {
            const atch = new MessageAttachment(rankCard.buf, 'rank.png')
            embed.attachFiles(atch)
            embed.setImage('attachment://rank.png');
            await channel.send(embed);
            msg.delete();
        }
        else {
            msg.edit(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} An error occured while making the card.`))
        }
    }
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