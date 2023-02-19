  
const { MessageEmbed } = require("discord.js");
const config = require("../../../config.js");
const prefix = require("../../../config.js")
const ee = require("../../../JSON/embed_Config.json");
const { format, createBar } = require("../../../function.js")
module.exports = {
    name: "nowplaying",
    category: "Music",
    aliases: ["np"],
    cooldown: 4,
    useage: "nowplaying",
    description: "Shows current Track information",
    execute: async (client, message, args, cmduser, text, prefix) => {
    try{
      const { channel } = message.member.voice; // { message: { member: { voice: { channel: { name: "Allgemein", members: [{user: {"username"}, {user: {"username"}] }}}}}
      if(!channel)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | Please join a Channel first`)
        );
      if(!client.distube.getQueue(message))
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | I am not playing Something`)
          .setDescription(`The Queue is empty`)
        );
      if(client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | Please join **my** Channel first`)
          .setDescription(`Channelname: \`${message.guild.me.voice.channel.name}\``)
        );
      let queue = client.distube.getQueue(message);
      let track = queue.songs[0];
      console.log(track)
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext,ee.footericon)
        .setTitle(`Now playing :notes: ${track.name}`.substr(0, 256))
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .addField("Views", `▶ ${track.views}`,true)
        .addField("Dislikes", `:thumbsdown: ${track.dislikes}`,true)
        .addField("Likes", `:thumbsup: ${track.likes}`,true)
        .addField("Duration: ", createBar(track.duration*1000, client.distube.getQueue(message).currentTime))
      ).catch(e=>console.log(e.message))
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