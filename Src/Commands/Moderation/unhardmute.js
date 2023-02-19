const { MessageEmbed } = require('discord.js');
const hardmuteSchema = require("../../Database").hardmuteSchema;
const hardmuteConfig = require("../../../JSON/Hardmute_Config.json")
const parse = require('parse-duration');
const prettyMs = require("pretty-ms");
const moment = require("moment");

module.exports = {
    name: "unhardmute",
    aliases: ['uhm'],
    cooldown: 10,
    category: "Moderation",
    memberPermissions: ['MANAGE_GUILD'],
    usage: '<@mention | id>',
    description: 'Used to unhardmute someone',
    execute: async (client, message, args, text, instance) => {
        const { guild, member, author, channel, mentions } = message;
        const errEmbed = new MessageEmbed()
            .setColor(instance.color.error);
        const guildConfig = hardmuteConfig.find(x => x.guildId === guild.id);
        if (!guildConfig) return channel.send(errEmbed.setDescription(`${instance.emoji.error} Hardmute is not configured here.`))
        const muteRole = await guild.roles.cache.get(guildConfig.muteRole);
        if (!muteRole) return channel.send(errEmbed.setDescription(`${instance.emoji.error} Mute role was not found.`));

        const target = mentions.members.first() || guild.members.cache.get(args[0]);
        if (!target) return channel.send(errEmbed.setDescription(`${instance.emoji.error} Mention or provide ID of someone to unhardmute.`));
        if (target.roles.highest.position >= member.roles.highest.position) return channel.send(errEmbed.setDescription(`${instance.emoji.error} You cannot hardmute that member.`));

        const findData = await hardmuteSchema.findOne({ id: target.user.id });
        if (!findData) return channel.send(errEmbed.setDescription(`${instance.emoji.error} ${target} is not hardmuted.`));

        const muteRoleTarget = await guild.roles.cache.get(guildConfig.muteRole);
        if (muteRoleTarget) target.roles.remove(muteRoleTarget);
        await findData.roles.forEach(async (x) => {
            const role = await guild.roles.cache.get(x);
            if (role && role.position < guild.me.roles.highest.position && role.id !== guildConfig.muteRole) {
                target.roles.add(role)
            }
        });
        await hardmuteSchema.findOneAndDelete({ _id: findData._id });
        channel.send(errEmbed.setDescription(`${instance.emoji.success} ${target} was successfully unhardmuted.`).setColor(instance.color.success))
    }
}