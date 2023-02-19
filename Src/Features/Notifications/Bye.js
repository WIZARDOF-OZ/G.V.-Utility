const Discord = require("discord.js");
const Client = new Discord.Client();
const config = require("../../../JSON/Bye_Config.json");

const fetch = require("node-fetch");

/**
 * 
 * @param {Client} client 
 */

module.exports = (client) => {

    client.on("guildMemberRemove", async (member) => {
        const { guild } = member;
        const target = config.find(x => x.guildId == guild.id);
        if (!target) return;
        const channel = await guild.channels.cache.get(target.channelId);
        if (!channel) return;

        const value = [
            `${member.displayName} just leave our , we will miss you`,
        ];

      
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${member.displayName} just leave ${guild.name}`, member.user.displayAvatarURL({ dynamic: true }), "https://discord.gg/dfkwTAV")
            .setDescription(value.map(x => `> ${x}`).join("\n"))
            .setColor(`RANDOM`)
        .setImage(`https://data.whicdn.com/images/300928902/original.gif`)
            .setFooter(guild.name, guild.iconURL({dynamic:true}))
            .setTimestamp();
        channel.send(embed);
    });
}

