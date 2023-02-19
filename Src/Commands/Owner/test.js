const { MessageEmbed , Message} = require('discord.js');

module.exports = {
    name: "test",
    aliases: [],
    cooldown: 0,
    memberPermissions: [],
    ownerOnly : true,
    category: "BotDev",
    /**
     * 
     * @param {Message} message 
     */
    execute: async (client, message, args, text, instance) => {
        const {guild} = message

        

    }
}