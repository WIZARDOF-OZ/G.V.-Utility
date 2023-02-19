const { MessageEmbed } = require('discord.js');
const colorNames = require("colornames");
const colorConvert = require("color-convert");
const isHex = require("is-hexcolor");
const luminance = require('color-luminance');
const { createBar } = require('string-progress');

module.exports = {
    name: "color",
    aliases: ["colour"],
    cooldown: 0,
    memberPermissions: [],
    category: "Information",
    execute: async (client, message, args, text, instance) => {
        const { channel, guild, member, author } = message;

        try {
            const tname = args[0] || member.displayHexColor;
            if (!tname) return channel.send(new MessageEmbed().setDescription(`${instance.emoji.error} Please provide a color name, hex-code, role name or role id.\nTo get info about the color.`).setColor(instance.color.error));
            let color = guild.roles.cache.get(tname) ? guild.roles.cache.get(tname).hexColor : undefined || guild.roles.cache.find(r => r.name.toLowerCase() === tname.toLowerCase()) ? guild.roles.cache.find(r => r.name.toLowerCase() === tname.toLowerCase()).hexColor : undefined || colorNames(tname) ? colorNames(tname) : undefined || (tname.startsWith("#") ? tname : `#${tname}`)
            if (!isHex(color)) return channel.send(new MessageEmbed().setDescription(`${instance.emoji.error} Invalid color provided.\nError while parsing the color.`).setColor(instance.color.error));

            const rgb = colorConvert.hex.rgb(color);
            const hsl = colorConvert.hex.hsl(color);
            const cmyk = colorConvert.hex.cmyk(color);
            const brightness = luminance(rgb);

            const bar = createBar(200, Math.round(brightness), {
                slider: '<:lineDot:831948305071865856>',
                line: '<:line:831948213266546708>',
                size: 10
            }).replace(/<:lineDot:831948305071865856>/g, "><:lineDot:831948305071865856>")

            const capitalize = (s) => {
                if (typeof s !== 'string') return ''
                return s.charAt(0).toUpperCase() + s.slice(1)
            }

            const colorInfo = new MessageEmbed()
                .setTitle(colorNames(tname) ? `Color Info : ${capitalize(colorConvert.hex.keyword(colorNames(tname)) || "No name found")}` : "Color Information")
                .setColor(color)
                .setThumbnail(`https://dummyimage.com/500x500/${color.replace("#", "")}/&text=%23${color.replace("#", "").toUpperCase()}`)
                .addField(`Hex - Code`, `\`${color.toUpperCase() || "Undefined"}\``)
                .addField(`RGB - Code`, `\`${rgb[0]}\`, \`${rgb[1]}\`, \`${rgb[2]}\``)
                .addField(`HSL - Code`, `\`${hsl[0]}\`, \`${hsl[1]}%\`, \`${hsl[2]}%\``)
                .addField(`CMYK - Code`, `\`${cmyk[0]}\`, \`${cmyk[1]}\`, \`${cmyk[2]}\`, \`${cmyk[3]}\``)
                .addField("Luminance (Brightness)", `\`${Math.round(brightness)}\`/\`200\`%\n${bar}`);
            channel.send(colorInfo);
        } catch (e) {
            channel.send(new MessageEmbed().setDescription(`${instance.emoji.error} Error while parsing the color.`).setColor(instance.color.error));
        }
    }
}