const Discord = require('discord.js');
const client  = new Discord.Client();

module.exports = {
    name:"clear",
    aliases: ['delete', 'purge'],
    cooldown: 0,
    category: "Moderation",
    memberPermissions: ['MANAGE_MESSAGES'],
    description: 'Use to delete messages',

    execute: async(client, message, args) => {
        
        if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply("You Don't Have MANAGE MESSAGES Perms");

        if (!args[0]) return message.reply("Please enter the amount of messages to clear!");
     
            if(isNaN(args[0])) return message.reply("Please type a real number!");
     
            if(args[0] > 1000) return message.reply("You can't remove more than 1000 messages!");
            
            if(args[0] < 1) return message.reply("You have to delete at least one message!");
     
            await message.channel.messages.fetch({ limit: args[0]}).then(async n=>{
                await message.channel.bulkDelete(n)
                message.channel.send(`${message.author.tag}Deleted ${n.size} Messages`)
        });
     
    }
}
 