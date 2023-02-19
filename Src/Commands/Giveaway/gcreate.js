const { MessageEmbed, MessageCollector } = require('discord.js');
const parse = require("parse-duration");

module.exports = {
    name: "gcreate",
    category: "Giveaway",
    aliases: ['giveawaycreate'],
    cooldown: 0,
    memberPermissions: ['MANAGE_GUILD'],
    execute: async (client, message, args, text, instance) => {
        const { author, member, mentions, channel } = message;

        const collector = new MessageCollector(channel, (m) => m.author.id === author.id, { time: 1000 * 60 * 5 })

        channel.send(em("Where would you like to host the giveaway?", 1))
        let i = 1;
        let data = {};
        collector.on("collect", async (msg) => {
            const { content } = msg;
            if (content === "cancel") {
                collector.stop();
                channel.send("Canceled the setup.")
                return;
            }
            switch (i) {
                case 1:
                    const tchannel = msg.mentions.channels.first() || message.guild.channels.cache.get(content)
                    if (!tchannel) {
                        channel.send(em("Provided argument should be a channel.\nWhere would you like to host the giveaway?", 1))
                        i = 1;
                        return;
                    }
                    data.channel = tchannel.id;
                    channel.send(em("What will be the duration of the giveaway?", 2));
                    i++
                    break;
                case 2:
                    const time = parse(msg.content);
                    if (!time) {
                        channel.send(em("Provided argument should be a valid duration.\nWhat will be the duration of the giveaway?", 2))
                        i = 2
                        return;
                    }
                    data.duration = time;
                    channel.send(em("What are you giving away?", 3))
                    i++
                    break;
                case 3:
                    data.prize = msg.content;
                    channel.send(em("How many winners you want for the giveaway?", 4))
                    i++
                    break;

                case 4:
                    const noWinners = parseInt(msg.content);
                    if (isNaN(noWinners)) {
                        channel.send(em("Provided argument should be a number.\nHow many winners you want for the giveaway?", 4))
                        i = 3
                        return;
                    }
                    data.winners = noWinners;
                    collector.stop();
                    channel.send(`🎉 **Created a giveaway in <#${data.channel}>.**`)
                    message.guild.channels.cache.get(data.channel).awaitMessages(x => x.author.id === client.user.id && x.content.startsWith("Created the giveaway"), { max: 1 }).then(collected => {
                        collected.first().delete();
                    });
                    await client.giveaways.startGiveaway({
                        prize: data.prize || "No Prize",
                        channelId: data.channel || message.channel,
                        guildId: message.guild.id,
                        duration: data.duration || 1000 * 60 * 1,
                        winners: noWinners || 1,
                        hostedBy: message.author.id
                    });
                    break;
            }

        })
        function em(msg, num) {
            const embed = new MessageEmbed()
                .setColor(instance.color.info)
                .setDescription(`${msg}\nType \`cancel\` to stop the process.`);
            return embed;
        }
    }
}

/*
await client.giveaways.startGiveaway({
            prize: 'Discord Nitro Classic',
            channelId: message.channel.id,
            guildId: message.guild.id,
            duration: 30000,
            winners: 1,
            hostedBy: message.author.id
        });
*/
