const process = require("process");

module.exports = {
    name: 'restart',
    aliases: ['rs'],
    description: 'To restart the bot.',
    category: "BotDev",
    ownerOnly: true,
    execute: async (client, message, args, text, instance) => {
        await message.channel.send("👌")
        process.exit();
    }
}