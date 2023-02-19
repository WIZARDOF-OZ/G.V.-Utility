module.exports = {
    name: 'kill',
    aliases: [],
    description: 'To kill the bot.',
    category: "BotDev",
    ownerOnly: true,
    execute: async (client, message, args, text, instance) => {
        await message.channel.send("👌")
        client.destroy();
    }
}