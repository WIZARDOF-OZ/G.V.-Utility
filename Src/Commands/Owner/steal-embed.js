module.exports = {
    name: 'stealembed',
    aliases: ['se'],
    usage: '<message link>',
    category:"BotDev",
    ownerOnly: true,
  
    execute: async (client, message, args, text, instance) => {
      if (!args[0]) return message.reply('Please provide a message link').then((m) => m.delete({ timeout: 1000 * 8 }))
      if (!args[0].startsWith('https://discord.com/channels')) return message.reply('Please provide a message link').then((m) => m.delete({ timeout: 1000 * 8 }))
  
      const channelId = args[0].split("/")[5];
      const messageId = args[0].split("/")[6];
      const chan = client.channels.cache.get(channelId)
      if (!chan) return message.channel.send('I was not able to find that message.');
  
      chan.messages.fetch({ around: messageId, limit: 1 }).then(messages => {
  
        let embed = messages.first().embeds[0]
        if (!embed) return message.reply('That message is not an embed')
  
        message.channel.send({ embed: embed })
      })
    }
  }
  