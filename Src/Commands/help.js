const { MessageEmbed, Client, Message } = require('discord.js');
const {stripIndents} = require("common-tags")
const db = require("old-wio.db")
const {Prefix , prefix, PREFIX} = require("../../config.js")




module.exports = {
    name: "helpinfo",
    cooldown: 3,
    memberPermissions: [],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @param {String} text 
     * @param {Object} instance 
     */
    execute: async (client, message, args, text, instance) => {
try{
        const WIZARDOFOZᶫᵒᵛᵉᵧₒᵤ = await client.users.cache.get("583666642010112000");
        let commands = message.client.commands.array();

        const { author, channel , guild} = message;
        let category = await client.commands.map(x => x.category);
       
        const Description = `My Prefix For **${message.guild.name}** Is **${prefix}**\n\nFor More Command Information, Type The Following Command:\n**${prefix}help <command Name> or** <@${client.user.id}> **help <command name>**` 
        let embed = new MessageEmbed()
            .setAuthor(guild.iconURL({dynamic: true}))
            .setDescription(Description)
            .setFooter(`Coded with 🍵 by ${WIZARDOFOZᶫᵒᵛᵉᵧₒᵤ.tag}`, WIZARDOFOZᶫᵒᵛᵉᵧₒᵤ.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(`RANDOM`);

            let catList = []
            for (let i = 0; i < category.length; i++) {
                if (!catList.includes(category[i])) {
                    catList.push(category[i])
                    let cmdList = await client.commands.filter(x => x.category === category[i]).map(x => "`" + x.name + "`").join(", ")
                    embed.addField(category[i] || "Misc", cmdList)
                }
            }
     
      if(!args[0]) return message.channel.send(embed)

      else {
        const helpembed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
    
        const command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        if (!command) {
            return message.channel.send(embed.setColor(`RED`).setDescription(`No Information found for command **${args[0].toLowerCase()}**`));
        }
        
    
        helpembed.setDescription(stripIndents`
        ** Command -** \`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\`\n
        ** Description -** \`${command.description || "No Description provided."}\`\n
        ** Usage -** [   \`${command.usage ? `${command.usage}` : "No Usage"}\`   ]\n
        ** Category -** [   \`${command.category ? `${command.category}` : "No category found"}\`   ]\n
        ** Examples -** \`${command.example ? `${command.example}` : "No Examples Found"}\`\n
        ** Aliases -** [ \`${command.aliases ? command.aliases.join(" , ") : "None."}\` ]`)
        embed.setFooter(message.guild.name, message.guild.iconURL())
    
        return message.channel.send(helpembed)

      }
    }catch(e) {
        console.log(e)
        message.channel.send(new MessageEmbed()
        .setColor(`RED`)
        .setFooter(`ONE ERROR OCCURED AT`)
        .setTimestamp()
        .setTitle(`❌ ERROR | An error occurred`)
        .setDescription(`\`\`\`${e.stack}\`\`\``)
      );
    }
    }
}