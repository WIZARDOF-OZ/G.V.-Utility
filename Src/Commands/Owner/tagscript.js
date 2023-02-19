const TR = require("tag-replacer");
const tagscript = require("../../Functions/Addon/TagScript/TagScript");

module.exports = {
    name: "tagscript",
    aliases: ["tsc"],
    cooldown: 0,
    category: "BotDev",
    ownerOnly: true,
    execute: async (client, message, args, text, instance) => {
        if(!args[0])return message.channel.send("Please provide some content.")
        const tag = new TR(tagscript(message, client), false);
        const replace = tag.replace(text);
        message.channel.send(replace);
    }
}