const { Embeds } = require("discord-paginationembed");
const Pagination = require("discord-paginationembed");

const info = require("./Assets/Info_Embed");
const usage = require("./Assets/Usage_Embed");

module.exports = (client) => {

    client.page = async function (message, embeds) {
        const { author, guild, channel } = message;

        embeds.map((e, i) => e.setFooter(`Page -> ${i++ + 1} | ${embeds.length}`))
        embeds.push(info);

        const m = new Pagination.Embeds()
            .setArray(embeds)
            .setAuthorizedUsers([author.id])
            .setChannel(channel)
            .setTimeout(1000 * 60 * 5)
            .setPageIndicator(false)
            .setPage(1)
            .setColor("#191A26")
            .setTimestamp()
            .setDisabledNavigationEmojis(["all"])
            .setClientAssets({ prompt: `To what page would you like to go?` })
            .setFunctionEmojis({
                "⏮️": (_, instance) => { //1st page
                    instance.setPage(1)
                },
                "◀️": (_, instance) => { //Previous Page
                    if (instance.page === 1) return;
                    instance.setPage(instance.page - 1)
                },
                "▶️": (_, instance) => { //Next Page
                    if (instance.page == embeds.length) return instance.setPage(embeds.length - 1)
                    instance.setPage(instance.page + 1)
                },
                "⏭️": (_, instance) => { //Last Page
                    instance.setPage(embeds.length - 1)
                },
                "↗": (_, instance) => { //Jump Page
                    //default
                },
                "⏹": (_, instance) => { //Delete | Over
                    message.react("✅").catch(e => { });
                    instance.clientAssets.message.delete();
                    return Promise.reject('stopped')
                },
                "ℹ": (_, instance) => { //Info
                    instance.setPage(embeds.length);
                }
            })
        await m.build().catch(e => { });
    }

}