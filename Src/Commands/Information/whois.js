const Discord = require("discord.js")
const moment = require('moment');
var { MessageEmbed } = require("discord.js")

const status = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline/Invisible"
};

module.exports = {
    
        name: "whois",
        description: "userinfo",
        category: "Information",
        usage: "m/whois <mention a member/member id>",
        aliases: ['ui', 'userinfo'],
  
    execute: async (client, message, args) => {

        var permissions = [];
        var acknowledgements = 'None';
        let whoisPermErr = new Discord.MessageEmbed()
        .setTitle("**User Permission Error!**")
        .setDescription("**Sorry, you don't have permissions to use this! ❌**")

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        

        if(member.hasPermission("KICK_MEMBERS")){
            permissions.push("Kick Members");
        }
        
        if(member.hasPermission("BAN_MEMBERS")){
            permissions.push("Ban Members");
        }
        
        if(member.hasPermission("ADMINISTRATOR")){
            permissions.push("Administrator");
        }
    
        if(member.hasPermission("MANAGE_MESSAGES")){
            permissions.push("Manage Messages");
        }
        
        if(member.hasPermission("MANAGE_CHANNELS")){
            permissions.push("Manage Channels");
        }
        
        if(member.hasPermission("MENTION_EVERYONE")){
            permissions.push("Mention Everyone");
        }
    
        if(member.hasPermission("MANAGE_NICKNAMES")){
            permissions.push("Manage Nicknames");
        }
    
        if(member.hasPermission("MANAGE_ROLES")){
            permissions.push("Manage Roles");
        }
    
        if(member.hasPermission("MANAGE_WEBHOOKS")){
            permissions.push("Manage Webhooks");
        }
    
        if(member.hasPermission("MANAGE_EMOJIS")){
            permissions.push("Manage Emojis");
        }
    
        if(permissions.length == 0){
            permissions.push("No Key Permissions Found");
        }
    
        if(member.user.id == message.guild.ownerID){
            acknowledgements = 'Server Owner';
        }
        

try {
    

     const flags = {
            DISCORD_EMPLOYEE: 'Discord Employee <:DiscordStaff:721437079300604035>  ',
            DISCORD_PARTNER: 'Discord Partner <a:Discord_Partner:840623482457948201>  ',
            BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1) <:bug_hunter_badge:840623658211999774> ',
            BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2) <:Bug_Hunter_Gold:840623542713712641>',
            HYPESQUAD_EVENTS: 'HypeSquad Events<a:Hypesquad:837258853627461632> ',
            HOUSE_BRAVERY: 'House of Bravery <:bravery:840625416531476500> ',
            HOUSE_BRILLIANCE: 'House of Brilliance <:brilliance:840626463006523402> ',
            HOUSE_BALANCE: 'House of Balance <:balance:840626515544506408>',
            EARLY_SUPPORTER: 'Early Supporter <:EarlySupporterBadge:840624148015218689> ',
            TEAM_USER: 'Team User <:DiscordStaff:837752668918251600> ',
            SYSTEM: 'System',
            VERIFIED_BOT: 'Verified Bot <:verifiedBot:840624681303277599> ',
            VERIFIED_DEVELOPER: 'Verified Bot Developer <:VerifiedBotDeveloper:840624514802647053> '
      };
    
      const userFlags = member.user.flags.toArray();
       let nickname = member.nickname !== undefined && member.nickname !== null ? member.nickname: "NONE";

        const embed = new Discord.MessageEmbed()
            .setDescription(`<@${member.user.id}>`)
            
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
            .setColor(member.roles.highest.hexColor)
            .setFooter(`ID: ${message.author.id}`)
            .setThumbnail(member.user.displayAvatarURL({dynamic : true , size: 4096}))
            .setTimestamp()
            .addField("<:m_dot2:837258057414475777>__Status__",`${status[member.user.presence.status]}`, true)
            .addField('<:m_dot2:837258057414475777>__Joined at:__ ',`${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
            .addField('<:m_dot2:837258057414475777>__Created On__', member.user.createdAt.toLocaleString(), true)
            .addField("<:m_dot2:837258057414475777>__Badges__: ",`${userFlags.length ? userFlags.map(flag => flags[flag]).join(',') : 'None'}`,true)
            .addField("<:m_dot2:837258057414475777>__Is a bot?__",`${status[member.user.bot]}`, true)
            .addField("<:m_dot2:837258057414475777>__Playing__", member.presence.activities[0] ? member.presence.activities[0].state : `User Doesn't have a custom status!`, true)
           .addField("<:m_dot2:837258057414475777>__Nickname__", `${nickname}`, true)
            .addField(`\n<:m_dot2:837258057414475777>__Roles [${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).length}]__`,`${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id }>`).join(" **|** ") || "No Roles"}`, true)
            .addField("\n<:m_dot2:837258057414475777>__Acknowledgements:__ ", `${acknowledgements}`, true)
            .addField("\n<:m_dot2:837258057414475777>__Permissions:__ ", `${permissions.join(` | `)}`);
            
        message.channel.send(`<a:redbadge:837717474107326477>UserInfo Of \`\`${member}\`\`<a:redbadge:837717474107326477>`,{embed})

    } catch (e) {
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
    
