const { MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const fetch = require("node-fetch");
module.exports = {
    name: "instagram",
    aliases: ["insta"],
    cooldown: 0,
    memberPermissions: [],
    category: "Information",
    execute: async (client, message, args, text, instance) => {

        let nosearch = new MessageEmbed()
            .setDescription(`${instance.emoji.error} Maybe it's useful to actually search for someone...!`)
            .setColor(instance.color.error);
        const name = args.join(" ");
        const name2 = name.replace(/\s+/g, '')
        if (!name) return message.channel.send(nosearch);

        const url = `https://instagram.com/${name2}/?__a=1`;
        let res;
        let unabletofind = new MessageEmbed()
            .setDescription(`${instance.emoji.error} Unable to find the user account`)
            .setColor(instance.color.error);

        try {
            res = await fetch(url).then(url => url.json());
        } catch (e) {
            return message.channel.send(unabletofind);
        }
        try {
            const account = res.graphql.user;
            const embed = new MessageEmbed()
                .setColor(instance.color.info)
                .setTitle(account.full_name)
                .setURL(`https://instagram.com/${name2}`)
                .setThumbnail(account.profile_pic_url_hd)
                .addField("Profile information", stripIndents`**- Username:** ${account.username}
            **- Full name:** ${account.full_name}
            **- Biography:** ${account.biography.length == 0 ? "none" : account.biography}
            **- Posts:** ${account.edge_owner_to_timeline_media.count}
            **- Followers:** ${account.edge_followed_by.count}
            **- Following:** ${account.edge_follow.count}
            **- Private account:** ${account.is_private ? "Yes 🔐" : "Nope 🔓"}`);
            message.channel.send(embed);
        } catch (e) {
            return message.channel.send(unabletofind)
        }
    }
}