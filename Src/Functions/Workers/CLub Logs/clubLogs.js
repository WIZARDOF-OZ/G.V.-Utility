const fetch = require("node-fetch");
const nodeCache = require("node-cache");
const moment = require("moment");
const config = require("./config");
const { MessageEmbed } = require("discord.js");
const preset = {
    joinColor: "#19E83B",
    leaveColor: "#E81923",
    settingsColor: "#E8E219",
    roleColor: "#19ACE8"
}

function clubLogs(data, channel, interval) {
    let i = 0;
    setInterval(() => {
        i++;
        if (i == data.length) i = 0;
        const tag = data[i];
        start(tag, channel)
    }, interval);
}

module.exports = clubLogs;

const clubCache = new nodeCache({ checkperiod: 0 });
async function start(tag, channel) {
    fetch(`https://brawlify.com/stats/starttracking/${tag.replace("#", "")}?v=b152d7c35107ad45bf411169866d3&p=logs`)
    const res = await fetch(`https://api.brawlify.com/clublog/${tag.replace("#", "")}`, {
        headers: {
            "Authorization": `Bearer ${config.BRAWLIFY_API}`
        }
    }).then(r => r.json());
    if (res.status !== "ok") return;

    const { club, history } = res;
    if (!clubCache.has(tag)) return clubCache.set(tag, history);
    const oldData = clubCache.get(tag)
    const newData = history.filter(x => !oldData.map(d => d.timestamp).includes(x.timestamp));
    const embeds = await makeEmbed(newData, tag);
    embeds.forEach(em => {
        channel.send(em)
    });
    clubCache.set(tag, history)
}

async function makeEmbed(array, tag) {
    let out = [];

    for (let i = 0; i < array.length; i++) {
        const raw = array[i];
        const { type, timestamp } = raw;
        let club = await getClub(tag);
        if (!club.status) return;
        club = club.data;

        if (type === "members") {
            if (raw.data.joined === true) {
                const tag = raw.data.player.tag;
                const getAPI = await getPlayer(tag)
                if (!getAPI.status) return;
                const player = getAPI.data;

                const playerinfo = [
                    `> <:Pos:806458500200661073> **Name**: [${player.name} (${player.tag})](https://www.brawlify.com/stats/profile/${tag})`,
                    `> <:Trophy_B:794043009699545089> **Trophies**: ${separate(player.trophies)}`,
                    `> <:Required_Trophies:789425152789053451> **Position**: ${club.members.findIndex(x => x.tag === player.tag) ? `\`#${club.members.findIndex(x => x.tag === player.tag) + 1}\`` : "`NOT_FOUND`"}`,
                    `> <:Members:789425597742972948> **Total Club Members**: \`${club.members.length || "0"}\`/\`100\``,
                    `> <:Club_Trophies:789425841661804544> **Club Trophies**: ${separate(club.trophies)}`
                ];

                const embed = new MessageEmbed()
                    .setAuthor(`${club.name} (${club.tag})`, `https://cdn.brawlify.com/club/${club.badgeId}.png?v=1`, `https://www.brawlify.com/stats/club/${club.tag.replace("#", "")}`)
                    .setColor(preset.joinColor)
                    .setTitle("Member Joined!")
                    .setDescription(`${playerinfo.join("\n") || "ERROR_WHILE_SHOWING_THE_DATA"}`)
                    .setTimestamp(moment.unix(timestamp).toISOString());

                out.push(embed);
            }
            else if (raw.data.joined === false) {
                const tag = raw.data.player.tag;
                const getAPI = await getPlayer(tag)
                if (!getAPI.status) return;
                const player = getAPI.data;

                const playerinfo = [
                    `> <:Pos:806458500200661073> **Name**: [${player.name} (${player.tag})](https://www.brawlify.com/stats/profile/${tag})`,
                    `> <:Trophy_B:794043009699545089> **Trophies**: ${separate(player.trophies)}`,
                    `> <:Club:789421935967862785> **New Club**: ${player.club.name ? `[${player.club.name} (${player.club.tag}](https://www.brawlify.com/stats/club/${club.tag.replace("#", "")}))` : "[NO_CLUB_FOUND](https://www.brawlify.com)"}`,
                    `> <:Members:789425597742972948> **Total Club Members**: \`${club.members.length || "0"}\`/\`100\``,
                    `> <:Club_Trophies:789425841661804544> **Club Trophies**: ${separate(club.trophies)}`
                ];

                const embed = new MessageEmbed()
                    .setAuthor(`${club.name} (${club.tag})`, `https://cdn.brawlify.com/club/${club.badgeId}.png?v=1`, `https://www.brawlify.com/stats/club/${club.tag.replace("#", "")}`)
                    .setColor(preset.leaveColor)
                    .setTitle("Member Left!")
                    .setDescription(`${playerinfo.join("\n") || "ERROR_WHILE_SHOWING_THE_DATA"}`)
                    .setTimestamp(moment.unix(timestamp).toISOString());;

                out.push(embed);
            }
        }

        else if (type === "settings") {
            const { type: settingsType } = raw.data;

            if (settingsType === "status") {

                const info = [
                    `${codeBlock(`- ${raw.data.old}`, 'diff')}`,
                    `${codeBlock(`+ ${raw.data.new}`, 'diff')}`
                ];


                const embed = new MessageEmbed()
                    .setAuthor(`${club.name} (${club.tag})`, `https://cdn.brawlify.com/club/${club.badgeId}.png?v=1`, `https://www.brawlify.com/stats/club/${club.tag.replace("#", "")}`)
                    .setColor(preset.settingsColor)
                    .setTitle("Club Status Updated!")
                    .addField("Before", `${info[0]}`)
                    .addField("After", info[1])
                    .setTimestamp(moment.unix(timestamp).toISOString());;

                out.push(embed);
            }

            else if (settingsType === "description") {

                const info = [
                    `${codeBlock(`- ${raw.data.old}`, 'diff')}`,
                    `${codeBlock(`+ ${raw.data.new}`, 'diff')}`
                ];


                const embed = new MessageEmbed()
                    .setAuthor(`${club.name} (${club.tag})`, `https://cdn.brawlify.com/club/${club.badgeId}.png?v=1`, `https://www.brawlify.com/stats/club/${club.tag.replace("#", "")}`)
                    .setColor(preset.settingsColor)
                    .setTitle("Club Description Updated!")
                    .addField("Before", `${info[0]}`)
                    .addField("After", info[1])
                    .setTimestamp(moment.unix(timestamp).toISOString());;

                out.push(embed);
            }

            else if (settingsType === "requirement") {

                const info = [
                    `${codeBlock(`- ${raw.data.old}`, 'diff')}`,
                    `${codeBlock(`+ ${raw.data.new}`, 'diff')}`
                ];


                const embed = new MessageEmbed()
                    .setAuthor(`${club.name} (${club.tag})`, `https://cdn.brawlify.com/club/${club.badgeId}.png?v=1`, `https://www.brawlify.com/stats/club/${club.tag.replace("#", "")}`)
                    .setColor(preset.settingsColor)
                    .setTitle("Club Trophy Requirement Updated!")
                    .addField("Before", `${info[0]}`)
                    .addField("After", info[1])
                    .setTimestamp(moment.unix(timestamp).toISOString());;

                out.push(embed);
            }

        }

        else if (type === "roles") {
            const { promote, old: oldRole, new: newRole } = raw.data;

            if (promote === true) {

                const info = [
                    `${codeBlock(`- ${oldRole}`, 'diff')}`,
                    `${codeBlock(`+ ${newRole}`, 'diff')}`
                ];

                const tag = raw.data.player.tag;
                const getAPI = await getPlayer(tag)
                if (!getAPI.status) return;
                const player = getAPI.data;

                const playerinfo = [
                    `> <:Pos:806458500200661073> **Name**: [${player.name} (${player.tag})](https://www.brawlify.com/stats/profile/${tag})`,
                    `> <:Trophy_B:794043009699545089> **Trophies**: ${separate(player.trophies)}`,
                    `> <:Required_Trophies:789425152789053451> **Position**: ${club.members.findIndex(x => x.tag === player.tag) ? `\`#${club.members.findIndex(x => x.tag === player.tag) + 1}\`` : "`NOT_FOUND`"}`
                ];

                const embed = new MessageEmbed()
                    .setAuthor(`${club.name} (${club.tag})`, `https://cdn.brawlify.com/club/${club.badgeId}.png?v=1`, `https://www.brawlify.com/stats/club/${club.tag.replace("#", "")}`)
                    .setColor(preset.roleColor)
                    .setTitle("Member Promoted!")
                    .setDescription(playerinfo.join("\n"))
                    .addField("Before", `${info[0]}`)
                    .addField("After", info[1])
                    .setTimestamp(moment.unix(timestamp).toISOString());;

                out.push(embed);
            }

            else if (promote === false) {

                const info = [
                    `${codeBlock(`- ${oldRole}`, 'diff')}`,
                    `${codeBlock(`+ ${newRole}`, 'diff')}`
                ];

                const tag = raw.data.player.tag;
                const getAPI = await getPlayer(tag)
                if (!getAPI.status) return;
                const player = getAPI.data;

                const playerinfo = [
                    `> <:Pos:806458500200661073> **Name**: [${player.name} (${player.tag})](https://www.brawlify.com/stats/profile/${tag})`,
                    `> <:Trophy_B:794043009699545089> **Trophies**: ${separate(player.trophies)}`,
                    `> <:Required_Trophies:789425152789053451> **Position**: ${club.members.findIndex(x => x.tag === player.tag) ? `\`#${club.members.findIndex(x => x.tag === player.tag) + 1}\`` : "`NOT_FOUND`"}`
                ];

                const embed = new MessageEmbed()
                    .setAuthor(`${club.name} (${club.tag})`, `https://cdn.brawlify.com/club/${club.badgeId}.png?v=1`, `https://www.brawlify.com/stats/club/${club.tag.replace("#", "")}`)
                    .setColor(preset.roleColor)
                    .setTitle("Member Demoted!")
                    .setDescription(playerinfo.join("\n"))
                    .addField("Before", `${info[0]}`)
                    .addField("After", info[1])
                    .setTimestamp(moment.unix(timestamp).toISOString());;
                out.push(embed);
            }
        }
    }
    return out;
}

async function getPlayer(tag) {
    try {
        const res = await fetch(`https://tke-general.screeneros.repl.co/api/profile/${tag.replace("#", "")}`).then(res => res.json())
        return res;
    } catch (e) {
        return {
            status: false,
            message: e
        }
    }
}

async function getClub(tag) {
    try {
        const res = await fetch(`https://tke-general.screeneros.repl.co/api/club/${tag.replace("#", "")}`).then(res => res.json())
        return res;
    } catch (e) {
        return {
            status: false,
            message: e
        }
    }
}

function separate(x) {
    return "`" + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`";
};

function codeBlock(text, lang) {
    return `\`\`\`${lang}\n${text}\n\`\`\``
};