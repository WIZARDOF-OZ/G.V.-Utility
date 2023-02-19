const logs = require('discord-logs');
const { MessageEmbed } = require('discord.js');
const servers = require("../../../JSON/Booster_Logs_Config.json");

module.exports = (client) => {
    logs(client);

    client.on('guildMemberBoost', async(member , message) => {
        
            const embed = new MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
                .addField(`${member.user.username} just __boosted__ the server!`, `>  Thank you, ${member} for boosting **${member.guild.name}**.\n>  You have unlocked the booster __perks__!`)
                .setTimestamp()
                .setFooter(member.guild.name)
                .setColor('#EF2A4D')
    
            guild.Channels.forEach(c => {
                const channel = client.channels.cache.get(c);
                if (channel) {
                    channel.send(embed)
                }
            });
            

        const guild = servers[member.guild.id]
        if (!guild) return;
       
      //  const perksChannel = `<#${guild.PerksChannel}>`;
    });

    client.on("guildMemberUnboost", (member) => {
        const guild = servers[member.guild.id]
        if (!guild) return;

        const embed = new MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
            .addField(`${member.user.username} __unboosted__ <a:catCrying:830734544205512705> the server!!?`, `> ${member}, Thank you for boosting **${member.guild.name}** before!`)
            .setColor('BLUE')
            .setTimestamp()
            .setFooter(member.guild.name)

        guild.Channels.forEach(c => {
            const channel = client.channels.cache.get(c);
            if (channel) {
                channel.send(embed)
            }
        });
    });
}