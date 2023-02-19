const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
 
    name: "addrole",
    aliases: ['addr', 'add'],
    cooldown: 5,
    category: "Moderation",
    memberPermissions: ['MANAGE_ROLES'],
    usage: '<@mention role> || id then select the user',
    description: 'Use to add role',

    execute: async(client, message, args) =>{
   
      if(!message.guild.me.permissions.has('MANAGE_ROLES')) return message.reply('I Need Manage Roles Perm !');

      if(!message.member.permissions.has('MANAGE_ROLES')) return message.reply('You Need Manage Roles Perm !');
  
      if(!args[0]) return message.reply('Usage :```Addrole bots/humans/@role @user1 @user2```');
  
      let role = message.mentions.roles.first() ||  message.guild.roles.cache.get(args[1]);
  
      if(!role) return message.reply('No role Mentioned !');
  
      if(message.guild.me.roles.highest.position <= role.position) return message.reply('Pls Check my role is above that role ');
  
      
  
     if(!message.member.roles.highest.position >= role.position && message.author.id != message.guild.ownerID) return message.reply("You Can't Manage That Role !");
  
     
  
     
  switch(args[0]){
  case `bots`:
  
          
  
          const botsofserver = message.guild.members.cache.filter(member=> member.user.bot);
  
        await   botsofserver.forEach(member=> {
  
           
  
            member.roles.add(role,`Responsible Moderator : ${message.author.tag}`).catch(err=> console.log(err));
  
          })
  
           
  
          await message.reply(`<a:verify:832259330077622375> Added Role \`${role.name}\` To All Bots ! (${botsofserver.size}))`);
  break;
  case `humans`:
    
        
           const manofserver = message.guild.members.cache.filter(member=> !member.user.bot);
  
        await   manofserver.forEach(member=> {
  
           
  
            member.roles.add(role,`Responsible Moderator : ${message.author.tag}`).catch(err=> console.log(err));
  
          })
  
         
  
          await message.reply(`<a:verify:832259330077622375> Added Role \`${role.name}\` To All Humans ! (${manofserver.size}))`);
  
          break;      
   
       default:
        
  const bandelog = message.mentions.members || message.guild.user.cache.get(args[3]);
  if(!bandelog) return message.reply(`No Users Mentioned !`)
  const msg1 = message.channel.send(`Adding Role \`${role.name}\` To \`${bandelog.size}\` Members \n Users => ${args.slice(1)}`); 
  await bandelog.forEach(n=>n.roles.add(role,`Responsible Moderator : ${message.author.tag}`))
  message.reply(`<a:verify:832259330077622375> Added \`${role.name}\` To ${bandelog.size} Users`)
        }   
  
  }
}
