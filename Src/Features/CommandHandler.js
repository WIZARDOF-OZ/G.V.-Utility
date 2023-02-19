const { Client, Message, MessageEmbed } = require("discord.js");
const moment = require("moment");
const config = require("../../config");
const { readdir, readdirSync } = require("fs");
const { runInContext } = require("vm");
/**
 * @param {Client} client 
 * @param {Message} message
 */

let cooldown = new Set();
module.exports = (client) => {

  
    let instance = {
        owners: config.owners,
        dev: config.dev,
        color: config.color,
        emoji: config.emoji,
        cooldown: [...cooldown],
        commands: client.commands,
        prefix: config.prefix,
        api: config.api,
        version: config.version,
        lastUpdated: config.lastUpdated
    }

    client.on("message", async (message) => {
        const { content, author, member, guild, channel } = message;

        if (author.bot) return;
        if (!guild) return;
        if (!content) return;

        const mentionRegex = new RegExp(`^<@!?${client.user.id}> `);
        var prefix = content.match(mentionRegex) ? content.match(mentionRegex)[0] : config.prefix;
        if (!content.toLowerCase().startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!cmd) return;

        let options = {
            name: cmd.name,
            description: cmd.description || "No Description",
            usage: cmd.usage || "Not Specified",
            enabled: cmd.enabled === false ? false : true,
            aliases: cmd.aliases || [],
            category: cmd.category || "Other",
            memberPermissions: cmd.memberPermissions || [],
            ownerOnly: cmd.ownerOnly || false,
            cooldown: cmd.cooldown || 0,
            execute: cmd.execute,
            run: cmd.run
        }
        const onDevMode = new MessageEmbed()
            .setColor(config.color.error)
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${config.emoji.error} The bot is on **dev mode**, All commands are disabled right now.`);
        if (config.dev.enabled && guild.id !== config.dev.guild) return channel.send(onDevMode)

        const disabledCmd = new MessageEmbed()
            .setColor(config.color.error)
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${config.emoji.error} This command has been disabled by the bot owner.`)
        if (!options.enabled) return channel.send(disabledCmd)

        const ownerOnlyCmd = new MessageEmbed()
            .setColor(config.color.error)
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${config.emoji.error} Only the bot owner can use this command.`)
        if (options.ownerOnly && !config.owners.includes(author.id)) return channel.send(ownerOnlyCmd);

        let cooldownEntries = [...cooldown];
        const checkCooldown = cooldownEntries.find(x => x.id === author.id && x.command === options.name);
        const onCooldown = new MessageEmbed()
            .setColor(config.color.error)
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${config.emoji.error} You are on a cooldown, Please wait for **${Math.round(Math.abs(new Date() - new Date(checkCooldown ? checkCooldown.timeOver : new Date())) / 1000)}** seconds.`);

        if (checkCooldown) return channel.send(onCooldown);

        const newCooldown = {
            id: author.id,
            command: options.name,
            timeOn: new Date().toISOString(),
            timeOver: moment().add(options.cooldown, 'seconds').toISOString()
        }
        if (options.cooldown !== 0) {
            cooldown.add(newCooldown);
        }
        setTimeout(() => {
            cooldown.delete(newCooldown)
        }, options.cooldown * 1000);

        let missingPermsMember = [];
        options.memberPermissions.forEach((perm) => {
            if (!member.hasPermission(perm)) {
                return missingPermsMember.push(perm)
            }
        });

        const noReqPermsMember = new MessageEmbed()
            .setColor(config.color.error)
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${config.emoji.error} You require the following perms in order to use this command.\n${missingPermsMember.map(x => `**• ${x}**`).join("\n")}`)
        if (missingPermsMember.length > 0) return channel.send(noReqPermsMember);

      

        instance.currentCmd = options;
        instance.cmdName = commandName;
        try {
            cmd.execute(client, message, args, args.join(" "), instance);
        } catch (e) {
            console.log(e);
            const errorEmbed = new MessageEmbed()
                .setColor(config.color.error)
                .setTitle("An Unexpected Error Occured")
                .setDescription("```js\n" + e + "```")
            channel.send(errorEmbed)
        }
    });
}
