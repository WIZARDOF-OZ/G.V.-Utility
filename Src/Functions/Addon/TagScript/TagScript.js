const { Message, Client, MessageEmbed } = require("discord.js");
const isEmoji = require('is-standard-emoji');
const sourcebin = require('sourcebin');
const fetch = require("node-fetch");
/**
 * 
 * @param {Message} message 
 * @param {Client} client 
 */

function tagScript(message, client) {
    const { channel } = message;
    const tags = {
        "delete": (args) => {
            message.deletable ? message.delete({ timeout: isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]) || 1 }) : channel.send("Can't delete message (Missing Perms).")
        },
        "react": (args) => {
            args.forEach(emoji => {
                const emote = client.emojis.cache.find(e => e.id === emoji || e.toString() === emoji || e.name.match(emoji))
                if (emote) message.react(emote.id)
                else if (isEmoji(emoji)) message.react(emoji)
            });
        },
        "message": (args) => {
            args.forEach(arg => {
                channel.send(arg)
            })
        },
        "reply": (args) => {
            args.forEach(arg => {
                message.reply(arg)
            })
        },
        "inreply": (args) => {
            args.forEach(arg => {
                message.inlineReply(arg)
            })
        },
        "dm": (args) => {
            args.forEach(arg => {
                message.author.send(arg).catch(e => { })
            })
        },
        "sembed": (args) => {
            try {
                args.forEach(arg => {
                    fetch(`https://cdn.sourceb.in/bins/${arg}/0`).then(res => res.json()
                    ).then(x => {
                        const embed = new MessageEmbed(x)
                        channel.send(embed)
                    })
                })
            } catch (e) {
                channel.send(e, { code: "js", split: true })
            }
        }
    }

    return tags;
}

module.exports = tagScript;