const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
    name: "meme",
    aliases: [],
    cooldown: 0,
    memberPermissions: [],
    category: "Fun",
    execute: async (client, message, args, text, instance) => {
        const subreddits = [
            'memes',
            'dankmemes',
            'meme',
        ];
        const sub = subreddits[Math.round(Math.random() * (subreddits.length - 1))];
        const url = `https://www.reddit.com/r/${sub}/hot.json`

        const post = await fetch(url)
            .then(res => res.json())
            .then(json => json.data.children.map(v => v.data));

        const embeds = post.map((random) => {
            const embed = new MessageEmbed()
            .setColor('#3FB97C')
            .setURL(`https://www.reddit.com/r/${random.subreddit}/comments/${random.id}`)
            .setTitle(random.title)
            .setImage(random.url)
            .setFooter(`👍 ${random.ups} | 💬 ${random.num_comments}`);
            return embed;
        });

        client.page(message , embeds);
    }
}