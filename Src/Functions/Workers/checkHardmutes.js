const muteSchema = require("../../Database").hardmuteSchema;
const hardMuteConfig = require("../../../JSON/Hardmute_Config.json");
const { Client } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */

function checkHardmutes(client) {
    setInterval(async () => {
        const allMutes = await muteSchema.find({});

        for (let i = 0; i < allMutes.length; i++) {
            const muted = allMutes[i];

            const guild = client.guilds.cache.get(muted.guildId);
            if (!guild) return;
            const member = guild.members.cache.get(muted.id);
            if (!member) return;

            const removeMute = new Date(muted.mutedTill) - new Date();
            if (removeMute < 0) {
                const guildConfig = hardMuteConfig.find(x => x.guildId === guild.id)
                const muteRole = await guild.roles.cache.get(guildConfig.muteRole || "123");
                if(muteRole) member.roles.remove(muteRole);
                await muted.roles.forEach(async (x) => {
                    const role = await guild.roles.cache.get(x);
                    if (role && role.position < guild.me.roles.highest.position && role.id !== guildConfig.muteRole) {
                       member.roles.add(role)
                    }
                });
                await muteSchema.findOneAndDelete({ _id: muted._id });
            }
        }
    }, 1000 * 30);
}

module.exports = checkHardmutes;