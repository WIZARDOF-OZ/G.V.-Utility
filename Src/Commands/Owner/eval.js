const interactions = require("discord-slash-commands-client");
const fetch = require("node-fetch");
const { MessageAttachment, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'eval',
    aliases: ['evaluate'],
    description: 'To evaluate something.',
    usage: "<content>",
    category: "BotDev",
    ownerOnly: true,
    execute: async (client, message, args, text, instance) => {
        if (!text) return;
        let msg = message,
            arguments = args,
            slash = new interactions.Client(client.token, client.user.id)
        const { channel, guild, author, member } = message
        try {
            var code = args.join(" ");
            if (code.match('process.env')) return;
            var evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            message.channel.send(evaled, { split: true, code: "js" })
        } catch (err) {
            message.channel.send(err, { split: true, code: "js" })
        }
    }
}

async function createSlash(slash, ID) {
    const res = await fetchAPI("https://database.screeneros.repl.co/api/statistics/club");
    if (!res.status) return;
    const array = res.data.map(d => {
        return d[Object.keys(d)[0]]
    });
    slash.createCommand({
        name: "club",
        description: "Shows TKE club's stats.",
        options: [
            {
                name: "Name",
                description: "Name of the club.",
                type: 3,
                required: true,
                choices: array.sort((a, b) => b.raw.trophies - a.raw.trophies).map(x => {
                    return {
                        name: x.raw.name,
                        value: `${x.raw.tag}`
                    }
                })
            }
        ]
    }, ID)
}
async function fetchAPI(uri) {
    try {
        const res = await fetch(uri, {
            headers: {
                "Authorization": "Bearer 1234567890"
            }
        }).then(res => res.json());
        return res;
    } catch (e) {
        console.log(e)
        return {
            status: false
        }
    }
}