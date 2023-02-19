const { MessageEmbed } = require('discord.js');
const hardmuteSchema = require("../../Database").hardmuteSchema;
const hardmuteConfig = require("../../../JSON/Hardmute_Config.json")
const parse = require('parse-duration');
const prettyMs = require("pretty-ms");
const moment = require("moment");

module.exports = {
    name: "hardmute",
    aliases: ['hm'],
    cooldown: 10,
    category: "Moderation",
    memberPermissions: ['MANAGE_GUILD'],
    usage: '<@mention | id> [duration]',
    description: 'Used to hardmute someone',
    execute: async (client, message, args, text, instance) => {
        const { guild, member, author, channel, mentions } = message;
        const errEmbed = new MessageEmbed()
            .setColor(instance.color.error);
        const guildConfig = hardmuteConfig.find(x => x.guildId === guild.id);
        if (!guildConfig) return channel.send(errEmbed.setDescription(`${instance.emoji.error} Hardmute is not configured here.`))
        const muteRole = await guild.roles.cache.get(guildConfig.muteRole);
        if (!muteRole) return channel.send(errEmbed.setDescription(`${instance.emoji.error} Mute role was not found.`));

        const target = mentions.members.first() || guild.members.cache.get(args[0]);
        if (!target) return channel.send(errEmbed.setDescription(`${instance.emoji.error} Mention or provide ID of someone to hardmute.`));
        if (target.roles.highest.position >= member.roles.highest.position) return channel.send(errEmbed.setDescription(`${instance.emoji.error} You cannot hardmute that member.`));

        if (args[1]) {
            const duration = parse(text.replace(args[0], ""));
            if (!duration) return channel.send(errEmbed.setDescription(`${instance.emoji.error} Unable to parse the provided duration.\nEg: hardmute @WizardOfOz 1hr 20s`));
            const memberRoles = target.roles.cache.filter(x => x.id !== guild.roles.everyone.id).map(x => x.id);
            const mutedTill = moment().add(duration, 'milliseconds').toISOString();

            const doc = {
                guildId: guild.id,
                id: target.user.id,
                responsibleUser: author.id,
                mutedOn: moment().toISOString(),
                mutedTill: mutedTill,
                roles: memberRoles
            }
            await new hardmuteSchema(doc).save();
            await target.roles.set([muteRole]);
            const doneEmbed = new MessageEmbed()
                .setColor(instance.color.success)
                .setDescription(`${instance.emoji.success} ${target} has been hardmuted by **${author.tag}** for **${prettyMs(duration, { verbose: true })}**.`);
            channel.send(doneEmbed);
        }
        else {
            const duration = parse('1y');
            if (!duration) return channel.send(errEmbed.setDescription(`${instance.emoji.error} Unable to parse the provided duration.\nEg: hardmute @Jordaar 1hr 20s`));
            const memberRoles = target.roles.cache.filter(x => x.id !== guild.roles.everyone.id).map(x => x.id);
            const mutedTill = moment().add(duration, 'milliseconds').toISOString();

            const doc = {
                guildId: guild.id,
                id: target.user.id,
                responsibleUser: author.id,
                mutedOn: moment().toISOString(),
                mutedTill: mutedTill,
                roles: memberRoles
            }
            await new hardmuteSchema(doc).save();
            await target.roles.cache.forEach(r => target.roles.remove(r).catch(e => {}))
            await target.roles.add(muteRole)
            const doneEmbed = new MessageEmbed()
                .setColor(instance.color.success)
                .setDescription(`${instance.emoji.success} ${target} has been hardmuted by **${author.tag}** for **${prettyMs(duration, { verbose: true })}**.`);
            channel.send(doneEmbed);
        }
    }
}