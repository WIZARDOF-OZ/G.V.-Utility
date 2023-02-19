const { MessageEmbed } = require("discord.js")

module.exports = {
  name: 'create-embed', // You Can Keep Any Name
    permissions: ['MANAGE_MESSAGES'], // You Can Keep Any Permission
    permissionError: 'You Cant Use This Command', // Optional
    description: 'Creates An Embed For You With Out Code', // Optional
    category:"Moderation",
        usage: '+embed #Channel-Name ^Title^Description^Footer^Color^Thumbnail^Link^Image-Link', // Optional

    execute: (client,message, args, text) => {
try{
        // Send Message In Channel You Want To 
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        if(!channel) return message.reply('Provide A Channel To Send Embed') // If No Channel Is Provided

        // Embed Options
        const title = text.split('^')[1] // [1] Because args[0] Is Channel // You Can Keep Anything Instead Of >
        if(!title) return message.reply('Provide Title For Embed.') // If No Title Is Provided
        const description = text.split('^')[2] // [1] Because args[0] Is Channel // You Can Keep Anything Instead Of >
        if(!description) return message.reply('Provide Description For Embed.') // If No Description Is Provided
        const footer = text.split('^')[3] // [1] Because args[0] Is Channel // You Can Keep Anything Instead Of >
        if(!footer) return message.reply('Provide Footer For Embed.') // If No Footer Is Provided
        const color = text.split('^')[4] // [1] Because args[0] Is Channel // You Can Keep Anything Instead Of >
        if(!color) return message.reply('Provide Color For Embed.') // If No Color Is Provided
        const thu = text.split('^')[5] // [1] Because args[0] Is Channel // You Can Keep Anything Instead Of >
        if(!thu) return message.reply('Provide Thumbnail For Embed.') // If No Thumbnail Is Provided
        const image = text.split('^')[6] // [1] Because args[0] Is Channel // You Can Keep Anything Instead Of >
        if(!image) return message.reply('Provide Image For Embed.') // If No Image Is Provided

        // Send Embed
        const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter(footer)
        .setImage(image)
        .setThumbnail(thu)
        channel.send(embed) // Send Embed
} catch(e) {
    console.log(e)
    message.channel.send( new MessageEmbed()
    .setColor('RED')
    .setFooter(`ONE ERROR OCCURED AT`)
    .setTimestamp()
    .setTitle(`❌ ERROR | An error occurred`)
    .setDescription(`\`\`\`${e.stack}\`\`\``))
    
}

    }


}
