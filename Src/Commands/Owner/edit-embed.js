const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'editembed',
    aliases: ['e-embed', 'ee'],
    category:"BotDev",
    usage: '<my msg link> <other msg link>',
    ownerOnly: true,

    execute: async (client, message, args, text, instance) => {
        if (!args[0]) return message.channel.send(`Please provide: <my msg link> <other msg link>`);
        if (!args[1]) return message.channel.send(`Please provide: <my msg link> <other msg link>`);
        if (!args[0].startsWith('https://discord.com/channels')) return message.reply('Please provide a message link [Argument 1]').then((m) => m.delete({ timeout: 1000 * 8 }))
        if (!args[1].startsWith('https://discord.com/channels')) return message.reply('Please provide a message link [Argument 2]').then((m) => m.delete({ timeout: 1000 * 8 }))

        const channelId = args[0].split("/")[5];
        const messageId = args[0].split("/")[6];
        const chan = client.channels.cache.get(channelId)
        if (!chan) return message.channel.send('I was not able to find that message.');

        const messages = await chan.messages.fetch(messageId)

        if (messages.author.id != client.user.id) return message.reply('That message dosent belong to me').then(m => m.delete({ timeout: 1000 * 30 }))

        const channelId2 = args[1].split("/")[5];
        const messageId2 = args[1].split("/")[6];
        const chan2 = client.channels.cache.get(channelId2)
        if (!chan2) return message.channel.send('I was not able to find that message.');

        const messages2 = await chan2.messages.fetch(messageId2)

        let embed2 = messages2.embeds[0]
        if (!embed2) return message.reply('That message is not an embed [2nd Args]')

        messages.edit({ embed: embed2.toJSON() }).then(message.channel.send('Done').then(m => m.delete({ timeout: 1000 * 30 })))
    }
}
