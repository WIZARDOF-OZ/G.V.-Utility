const { MessageEmbed, Client } = require("discord.js");
const { Stats } = require("fs");
const bot = new Client()
module.exports = {

        name: 'roleinfo',
        category: 'Information',
        description: "shows stats of the mentioned role",
        usage: "m/roleinfo <role mention/role id>",
        aliases: ['rinfo', 'rolei'],

    execute: async (bot, message, args) => {
    
    try{    var permissions = [];
        if (!args[0]) return message.channel.send("**Please Enter A Role!**")
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase());


        
   
        if (!role) return message.channel.send("**Please Enter A Valid Role!**");

        const status = {
            false: "No",
            true: "Yes"
        }

        let roleembed = new MessageEmbed()
            .setColor(`RANDOM`)
          
            .setThumbnail(message.guild.iconURL())
        .setDescription(`**__General Information__**
            **Role Name:** ${role},
            **Id:**  ${role.id},
            **Hex Color:** ${role.hexColor},
            **Created At**: ${role.createdAt.toLocaleDateString()},
            **Members:** ${role.members.size},
            **Role Position:** ${role.position},
            **Is the role mentionable?:** ${status[role.mentionable]}`)
            
            .addField("Permissions",`\`\`\`fix\n${role.permissions.toArray()}\`\`\``, true)
           
            .setFooter(message.member.displayName, message.author.displayAvatarURL(), true)
            .setTimestamp()

        message.reply(` *Information About* \`${role.name}\``,roleembed);
    }catch(e)  {
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