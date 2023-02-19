const Discord = require("discord.js");
const Client = new Discord.Client();
const config = require("../../../JSON/guildMemberAdd_Config.json");

const fetch = require("node-fetch");

/**
 * 
 * @param {Client} client 
 */

module.exports = (client) => {

    client.on("guildMemberAdd", async (member) => {
        const { guild } = member;
        const target = config.find(x => x.guildId == guild.id);
        if (!target) return;
        const channel = await guild.channels.cache.get(target.channelId);
        if (!channel) return;

        const value = [
            `<:p_dot:837257989563744256> ${member.displayName} Just Join Our Server`,
            `<:p_dot:837257989563744256> Make sure to read our rules first , here <#1043855007646240849>.`,
            `<:p_dot:837257989563744256> Get some roles yourself from , here <#1043851413618434068>.`
        ];

      
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${member.displayName} Just Join Our Server ${guild.name}`, member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(value.map(x => `> ${x}`).join("\n"))
            .setColor(`RANDOM`)
        .setImage(`https://cdn.discordapp.com/attachments/829287239732559912/852800000463339541/welcome_anime_girl_dc.jpeg`)
            .setFooter(guild.name, guild.iconURL({dynamic:true}))
            .setTimestamp();
        channel.send(`${member}`,embed);
    });
}

