  
const { MessageEmbed } = require("discord.js");
const config = require("../../../config.js");
const ee = require("../../../JSON/embed_Config.json")
const { getTracks, getPreview} = require("spotify-url-info")
module.exports = {
    name: "play",
    category: "Music",
    aliases: ["p", "playsong", "playtrack"],
    cooldown: 4,
    useage: "play <URL / TITLE>",
    description: "PLays a song from youtube",
    execute: async (client, message, args, cmduser, text, prefix) => {
      try{
        const { channel } = message.member.voice; // { message: { member: { voice: { channel: { name: "Allgemein", members: [{user: {"username"}, {user: {"username"}] }}}}}
        if(!channel)
          return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | Please join a Channel first`)
          );
          if(message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id)
          return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | Please join **my** Channel first`)
            .setDescription(`Channelname: \`${message.guild.me.voice.channel.name}\``)
          );
        if(!args[0])
          return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | You didn't provided a Searchterm`)
            .setDescription(`Usage: \`${prefix}play <URL / TITLE>\``)
          );
        message.channel.send(new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext,ee.footericon)
          .setTitle("Searching Song")
          .setDescription(`\`\`\`fix\n${args.join(" ")}\n\`\`\``) 
        ).then(msg=>msg.delete({timeout: 3000}).catch(e=>console.log(e.message)))
        //https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas
        if(args.join(" ").toLowerCase().includes("spotify") && args.join(" ").toLowerCase().includes("track")){
          getPreview(args.join(" ")).then(result => {
            client.distube.play(message, result.title);
          })
        }
        else if(args.join(" ").toLowerCase().includes("spotify") && args.join(" ").toLowerCase().includes("playlist")){
          getTracks(args.join(" ")).then(result => {
            for(const song of result)
            client.distube.play(message, song.name);
          })
        }
        else {
          client.distube.play(message, args.join(" "))
        }
      } catch (e) {
          console.log(String(e.stack).bgRed)
          return message.channel.send(new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`❌ ERROR | An error occurred`)
              .setDescription(`\`\`\`${e.stack}\`\`\``)
          );
      }
    }
  }