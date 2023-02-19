const Discord = require('discord.js');

module.exports = {
name:"eval",
category:"BotDev",
ownerOnly:true,
execute: async(client, message, args, text , instance) => {

    let process = args.join(" ");
    if (!process) {
      return message.channel.send("Please give a code to evaluate!");
    }

    let e;
    try {
      e = eval(process);
    } catch (err) {
      e = err;
    }
    let embed = new Discord.MessageEmbed()
      .setTitle("Eval Command")
      .setColor("RANDOM")
      .addField("Input", "```" + process + "```")
      .addField("Output", "```" + e + "```")
      .addField("Type Of", `\`\`\`${typeof e}\`\`\``);
    message.channel.send(embed);
}
}