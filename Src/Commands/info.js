const { MessageEmbed, Message, Client } = require('discord.js');
const Discord = require('discord.js')
const moment = require("moment");
const ms = require("pretty-ms")
const package = require("../../package.json");
const fetch = require("node-fetch");
const db = require("old-wio.db");
const { version} = require('../../package.json')
const { version: discordjsVersion } = require('discord.js');

module.exports = {
    name: "info",
    cooldown: 0,
    description: "Shows the bot's info",
    aliases: ["ping"],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    execute: async (client, message, args, text, instance) => {
        const { channel, author, member, guild } = message;
        let uptime = `${ms(client.uptime)}`;
        const generalInfo = [
            `Websocket Latency: ${client.ws.ping} ms`,
            `Bot Uptime : ${uptime}`,
            `Version: v${instance.version}`,
            `Errors Detected: ${client.errors.size || "0"}`,
            `Guild Count: ${client.guilds.cache.size}`,
            `Last Updated: ${moment(instance.lastUpdated).format("DD/MM/YYYY")}`
            
        ]

        const processInfo = [
            `Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} mb`,
            `Commands Loaded: ${client.commands.size}`,
            `Events Loaded: ${client.events}`,
            `Functions Loaded: 5 addons, 2 workers`,
            `Dependencies: ${Object.keys(package.dependencies).length}`
        ]

        const generalAPI = await latency(`https://tke-general.screeneros.repl.co/`);
        const generalDatabaseAPI = await latency(`https://database.screeneros.repl.co/`)
     
        const WIZARDOFOZᶫᵒᵛᵉᵧₒᵤ = await client.users.cache.get("583666642010112000");
        const externalStatus = [
            `MongoDB [Database]: <:online:846303129418465350>`,
            `Wizard's UtitliyGeneral APIs: ${generalAPI.status ? `<:online:846303129418465350>` : "<:offline:846311028177895444>"} ${generalDatabaseAPI.status ? `<:online:846303129418465350>` : "<:offline:846311028177895444>"}`,
            
            
        ]

     
        const embed = new MessageEmbed()
            .setAuthor(`${client.user.username}'s Information v${discordjsVersion}`, client.user.displayAvatarURL())
            .addField(`General Information`, btf(generalInfo))
            .addField(`Process Information`, btf(processInfo))
            .addField(`API Status`, btf(externalStatus))
            .setFooter(`Coded with 🍵 by ${WIZARDOFOZᶫᵒᵛᵉᵧₒᵤ.tag}`, WIZARDOFOZᶫᵒᵛᵉᵧₒᵤ.displayAvatarURL({ dynamic: true }))

        channel.send(embed);
    }
}

function btf(array) {
    return array.map(x => `> **•** ${x}`).join("\n")
}

async function latency(uri) {
    const current = new Date();
    try {
        await fetch(uri).then(res => res.json());
        return {
            status: true,
            latency: Math.abs(Math.round(current - new Date()) || 0)
        }
    } catch (e) {
        return {
            status: false,
            latency: null
        }
    }
}
