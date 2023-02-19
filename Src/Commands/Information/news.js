const { MessageEmbed } = require('discord.js');
const NewsAPI = require('newsapi');
module.exports = {
    name: "news",
    cooldown: 10,
    category: "Information",
    execute: async (client, message, args, text, instance) => {
        const newsapi = new NewsAPI(instance.api.news);
        const news = await newsapi.v2.topHeadlines({
            language: "en"
        });
        if (news.status !== "ok") return message.channel.send(new MessageEmbed().setColor(instance.color.error).setDescription(`${instance.emoji.error} An error occured while fetching data.`))

        let embeds = [];
        for (let i = 0; i < news.articles.length; i++) {
            const n = news.articles[i];

            const embed = new MessageEmbed()
                .setColor(instance.color.info)
                .setTitle(n.title || "No Title")
                .setURL(n.url)
                .setDescription(n.content || "No Content")
                .setAuthor(`Author: ${n.author || "Unknown"}`)
                .setFooter(`Published On`)
                .setTimestamp(n.publishedAt);
            embed.setImage(n.urlToImage);
            embeds.push(embed);
        }
        client.page(message, embeds)
    }
}