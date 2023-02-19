const { Client, Message, MessageEmbed } = require("discord.js");
const { nanoid } = require("nanoid");
const warnConfig = require("../../../JSON/Warnings_Config.json");
const db = require("../../Database");
const config = require("../../../JSON/Bad_Word_Config.json");
const filter = require('leo-profanity');

/**
 * 
 * @param {Client} client 
 */

module.exports = (client, def) => {

    filter.add(config.blackList);
    filter.remove(config.whiteList);

    client.on('message', async (message) => {
        const { content, author, guild, member, channel } = message;
        if (author.bot) return;
        if (!guild) return;
        if (!content) return;
        if (!config.guilds.includes(guild.id)) return;
        let checkPerms = [];
        config.ignoredPerms.forEach(x => {
            if (!member.hasPermission(x)) return checkPerms.push(false);
            else if (member.hasPermission(x)) return checkPerms.push(true);
        });
        if (!checkPerms.includes(false)) return;

        const checkbadWord = filter.check(content)
        if (!checkbadWord) return
        const badWords = filter.badWordsUsed(content);

        const warnId = nanoid(10);

        const badWordEmbed = new MessageEmbed()
            .setColor(def.color.success)
            .setDescription(`${def.emoji.success} ${author.toString()} has been warned. Using blacklisted word(s).`)
        await message.inlineReply({
            embed: badWordEmbed,
        });

        message.delete();

        const findUser = await db.warnSchema.findOne({
            id: author.id
        });
        if (findUser) {
            const newWarns = [...findUser.warnings, {
                type: warnConfig.type.badWord, //1 = user | 2 = auto mod (black list words) | 3 = auto mod (anti spam)
                id: warnId, //Unique ID
                reason: "AutoMod",
                responsibleUser: client.user.id,
                time: new Date().toISOString()
            }];
            await db.warnSchema.findOneAndUpdate({ _id: findUser._id }, {
                warnings: newWarns,
                lastUpdated: new Date().toISOString()
            });
        }
        if (!findUser) {
            const doc = {
                id: author.id,
                warnings: [{
                    type: warnConfig.type.badWord, //1 = user | 2 = auto mod (black list words) | 3 = auto mod (anti spam)
                    id: warnId, //Unique ID
                    reason: "AutoMod",
                    responsibleUser: client.user.id,
                    time: new Date().toISOString()
                }],
                lastUpdated: new Date().toISOString()
            }
            await new db.warnSchema(doc).save();
        }
    });
}