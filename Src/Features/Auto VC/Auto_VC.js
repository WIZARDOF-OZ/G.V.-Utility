const { Client } = require("discord.js");
const vcConfig = require("../../../JSON/Auto_VC_Config.json");
let VCs = new Set();
/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {

    client.on('voiceStateUpdate', (oldState, newState) => {
        const { guild, member, channel } = newState;
        if (!guild) return;
        if (!channel) return;
        const guildConig = vcConfig.find(x => x.guildId === guild.id);
        if (!guildConig) return;
        if (channel.id !== guildConig.channelId) return;
        if (!channel.parentID) return;

        guild.channels.create(`${member.displayName}'s VC`, {
            type: 'voice',
            parent: channel.parentID
        }).then(c => {
            c.lockPermissions();
            newState.setChannel(c.id, `Auto VC`);
            VCs.add(c.id)
        });
    });

    setInterval(() => {
        if (VCs.size > 0) {
            VCs.forEach(async (channel) => {
                const tchan = await client.channels.cache.get(channel);
                if (!tchan) return VCs.delete(channel);
                if (tchan.members.size === 0) {
                    VCs.delete(channel);
                    tchan.delete();
                }
            });
        }
    }, 1000 * 60 * 5);
}