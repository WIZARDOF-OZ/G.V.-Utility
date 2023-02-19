const { MessageEmbed } = require("discord.js");
const config = require("../../../config.js")
const ee = require("../../../JSON/embed_Config.json");
module.exports = {
  name: "queue",
  category: "Music",
  aliases: ["qu"],
  cooldown: 4,
  useage: "queue",
  description: "Shows the current queue",
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
    if(!queue)
      return message.channel.send(new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`❌ ERROR | I am not playing Something`)
        .setDescription(`The Queue is empty`)
      );

      let embed = new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext,ee.footericon)
        .setTitle(`Queue for: ${message.guild.name}`)

      let counter = 0;
      for(let i = 0; i < queue.songs.length; i+=20){
        if(counter >= 10) break;
        let k = queue.songs;
        let songs = k.slice(i, i + 20);
        message.channel.send(embed.setDescription(songs.map((song, index) => `**${index + 1 + counter * 20}** [${song.name}](${song.url}) - ${song.formattedDuration}`)))
        counter++;
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