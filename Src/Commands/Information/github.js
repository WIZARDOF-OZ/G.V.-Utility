const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.js');
const fetch = require('node-fetch');
const ee = require("../../../JSON/embed_Config.json")
module.exports = {
  
        name: 'github',
        description: 'Shows information about github user',
        aliases: ["github"],
        usage: '<query>',
        category: 'Information',
/**
 */
    execute: async (client, message, args, text , instance) => {
        
 
    const errEmbed2 = new MessageEmbed()
    .setColor(instance.color.error)
    const errEmbed = new MessageEmbed()
    .setColor(instance.color.error)
        const name = args.join(' ');
		if (!name) {
			return message.channel.send(errEmbed.setDescription(`${instance.emoji.error}Please provide a valid user`));
		}

		const url = `https://api.github.com/users/${name}`;

		let response;
		try {
			response = await fetch(url).then(res => res.json());
		}
		catch (e) {
            
			return message.channel.send(errEmbed2.setDescription(`${instance.emoji.error} An error occured, please try again!`,
	));
		}

		try{
			const embed = new MessageEmbed()
				.setColor(ee.Green)
				.setTitle(`${response.login} (${response.id})`)
				.setDescription(response.bio ? response.bio : `This Users Doesn't Have Bio`)
				.addFields(
					{ name: '>> Followers', value: `\`\`\`${response.followers.toLocaleString()}\`\`\``, inline: true },
					{ name: '>> Following', value: `\`\`\`${response.following.toLocaleString()}\`\`\``, inline: true },
					{ name: '>> Repositories', value: `\`\`\`${response.public_repos.toLocaleString()}\`\`\``, inline: true },
                
					{ name: '>> Email', value: `\`\`\`${response.email ? response.email : 'None'}\`\`\`` },
					{ name: '>> Company', value: `\`\`\`${response.company ? response.company : 'None'}\`\`\`` },
					{ name: '>> Location', value: `\`\`\`${response.location ? response.location : 'None'}\`\`\`` },
				)
				.setURL(response.html_url)
				.setThumbnail(response.avatar_url)
        		.setTimestamp();

			message.channel.send(embed);
		}
		catch (err) {
			return message.channel.send(
				`${instance.emoji.error} Please provide a valid user`,
			);
		} 
    }
    }
