

const express = require('express')
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hey there!'))

app.listen(port, () =>
console.log(chalk.cyan(`Your app is listening a http://localhost:${port}`))
);



require("dotenv").config();

    const DiscordJS = require("discord.js"),
    { MessageEmbed } = require("discord.js"),
    mongoose = require("mongoose"),
    DisTube = require('distube');
    getFiles = require("./Src/Functions/Base/getFiles"),
    chalk = require("chalk"),
    createTable = require("./Src/Functions/Base/createTable"),
    loadFunctions = require('./Src/Functions');

    const bot = new DiscordJS.Client({
        messageCacheLifetime: 60,
      fetchAllMembers: false,
      messageCacheMaxSize: 10,
      restTimeOffset: 0,
      restWsBridgetimeout: 100,
      disableEveryone: true,
        partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER']
        
    });
const client = new DiscordJS.Client({
    messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
    partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER']
    
});

const { format } = require("./function.js")
const { PREFIX , prefix } = require("./config.js")
const config = require("./config.js");
const  db = require("old-wio.db");
const fs = require("fs");
client.queue2 = new Map();
client.queue3 = new Map();
client.queue = new Map();
client.games = new Map();


client.commands = new DiscordJS.Collection();
client.events = 0;

async function load() {

    client.on("ready", () => {
        console.log(chalk.green("API > Connected"))
      


        const functions = loadFunctions(client);
        if (functions) {
            console.log(chalk.magenta(`Process > Loaded All Functions`))
        }

        const features = getFiles(config.featuresDir);
        client.events = features.length;
        console.log(chalk.cyan(`CommandHandler > Loaded ${features.length} Features`))
        features.forEach((files) => {
            const event = require(files[0]);
            event(client, config);
        });

        const commands = getFiles(config.commandDir);
        console.log(chalk.cyan(`CommandHandler > Loaded ${commands.length} Commands`))
        commands.forEach((cmd) => {
            const command = require(cmd[0]);
            client.commands.set(command.name, command);
        });
    })
        .on("disconnect", () => console.log(chalk.hex('#FF8800')("API > Disconnecting")))
        .on("reconnecting", () => console.log(chalk.yellow("API > Reconnecting")))
        .on("error", (e) => console.log(e))
        .on("warn", (info) => console.log(info))

    mongoose.connect(config.mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    }).then(() => {
        console.log(chalk.yellow("MongoDB > Connected"));
    }).catch((err) => {
        console.log(chalk.red("MongoDB > Error" + "\n" + err));
    });
}
const AntiSpam = require('discord-anti-spam');
const { modlogs } = require('./Src/Database');
const antiSpam = new AntiSpam({
 
	warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
	muteThreshold: 4, // Amount of messages sent in a row that will cause a mute
	kickThreshold: 5, // Amount of messages sent in a row that will cause a kick.
	banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
	maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
	warnMessage: '{@user}, Please stop spamming.', // Message that will be sent in chat upon warning a user.
	kickMessage: '**{user_tag}** has been kicked for spamming.', // Message that will be sent in chat upon kicking a user.
	muteMessage: '**{user_tag}** has been muted for spamming.',// Message that will be sent in chat upon muting a user.
	banMessage: '**{user_tag}** has been banned for spamming.', // Message that will be sent in chat upon banning a user.
	maxDuplicatesWarning: 6, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesBan: 4, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesMute: 8, // Ammount of duplicate message that trigger a mute.
	ignoredPermissions: [ 'ADMINISTRATOR'], // Bypass users with any of these permissions.
	ignoreBots: true, // Ignore bot messages.
	verbose: true, // Extended Logs from module.
	ignoredMembers: [], // Array of User IDs that get ignored.
	muteRoleName: "muted", // Name of the role that will be given to muted users!
	removeMessages: true,
  // If the bot should remove all the spam messages when taking action on a user!
	// And many more options... See the documentation.m
  
});

client.setMaxListeners(50) 


client.on('message', (message) => antiSpam.message(message)); 


load();
require("./distube-handler")(client);
if (config.dev.debug) {
    createTable(client.commands)
}

client.on("ready" , async() => {

    const channel = await client.channels.cache.get('842287740233711648')
    channel.send("<@583666642010112000> I am Online" )

    console.log(chalk.red(`${client.user.tag} is ready`))
})
client.on("message" , async message => {
 
    
    if (message.author.bot || !message.guild || message.webhookID) return;
    
    let PREFIX = await db.fetch(`prefix_${message.guild.id}`);
 
  
  const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
       
    if (message.content.match(mentionRegex)) {
      message.channel.send(
        new DiscordJS.MessageEmbed()
        .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
        .setDescription(`Hey <@${message.author.id}>, My prefix for this guild is \`\`\`${PREFIX}\`\`\`.Use \`\`\`${PREFIX}help\`\`\` or <@${client.user.id}> help to get a list of commands`)
         .setColor("RANDOM")
         .setFooter(`Requested by ${message.author.username}`)
         .setTimestamp()
)}

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);

    if(!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
     Prefix = matchedPrefix;


    
    if(!message.content.startsWith(prefix)) return;
    
     if (!message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
        return message.reply("**:x: I am missing the Permission to `EMBED_LINKS`**");
  
        let args = message.content
        .slice(matchedPrefix.length)
        .trim()
        .split(/ +/g);
      let cmd = args.shift().toLowerCase();
      
      if (cmd.length === 0) return;
    
      let cmdx = db.fetch(`cmd_${message.guild.id}`)
    
      if (cmdx) {
        let cmdy = cmdx.find(x => x.name === cmd)
        if (cmdy) message.channel.send(cmdy.responce.replace(/{user}/g, `${message.author}`)
    
         .replace(/{user_tag}/g, `${message.author.tag}`)
            .replace(/{user_name}/g, `${message.author.username}`)
            .replace(/{user_ID}/g, `${message.author.id}`)
            .replace(/{guild_name}/g, `${message.guild.name}`)
            .replace(/{guild_ID}/g, `${message.guild.id}`)
            .replace(/{memberCount}/g, `${message.guild.memberCount}`)
            .replace(/{size}/g, `${message.guild.memberCount}`)
            .replace(/{guild}/g, `${message.guild.name}`)
            .replace(/{member_createdAtAgo}/g, `${moment(message.author.createdTimestamp).fromNow()}`)
            .replace(/{member_createdAt}/g, `${moment(message.author.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
      )};
      
      let ops = {
                queue2: bot.queue2,
                queue: bot.queue,
                queue3: bot.queue3,
                games: bot.games
            }

      
      if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
    
      
       
})

client.on('messageReactionAdd', async(reaction, user) => {
  if(reaction.message.partial) await reaction.message.fetch();
  if(reaction.partial) await reaction.fetch();
  if(user.bot) return;
  if(!reaction.message.guild) return;
  if(reaction.message.id === '860068586016997376'){
      if(reaction.emoji.name === '🎫' , '<:b_dot:837258379591286804>:') {
          await reaction.message.guild.members.cache.get(user.id).roles.add('847408202110861312')
          user.send('You have obtained a role!')
      }
  }
})
client.on('messageReactionRemove', async(reaction, user) => {
  if(reaction.message.partial) await reaction.message.fetch();
  if(reaction.partial) await reaction.fetch();
  if(user.bot) return;
  if(!reaction.message.guild) return;
  if(reaction.message.id === '<messageid>'){
      if(reaction.emoji.name === '<emoji>') {
          await reaction.message.guild.members.cache.get(user.id).roles.remove('<roleID>')
          user.send('One of your roles has been removed!')
      }
  }
})




client.login(config.token)