const { Client, MessageAttachment, MessageEmbed } = require("discord.js");
const config = require("../../../JSON/Welcome_Config.json");
const baseUrl = "https://tke-general.screeneros.repl.co/api/welcome";
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
            `Make sure to read our rules first , here <#827595833469698068>.`,
            `Get some roles yourself from , here <#831445149787095060>.`,
            
        ];

        const img = await welcomeImg(member);
        const embed = new MessageEmbed()
            .setAuthor(`Welcome ${member.displayName} to ${guild.name}`, member.user.displayAvatarURL({ dynamic: true }), "https://discord.gg/dfkwTAV")
            .setColor(`RANDOM`)
            .setDescription(value.map(x => `> ${x}`).join("\n"))
            .attachFiles(img[1])
            .setImage(`attachment://${img[0]}`)
            .setFooter(guild.name)
            .setTimestamp();
        channel.send(embed);
    });
}

async function welcomeImg(member) {
    try {
        const res = await fetch(`${baseUrl}?name=${encodeURI(member.displayName)}&discriminator=${member.user.discriminator}&avatar=${member.user.displayAvatarURL({ dynamic: false, format: "png" })}`)
        const buff = await res.buffer();
        const atch = new MessageAttachment(buff, "welcome.png")
        return ["welcome.png", atch];
    } catch (e) {
        const atch = new MessageAttachment(`https://iili.io/qyDK74.gif`, "welcome.gif")
        return ["welcome.gif", atch];
    }
}