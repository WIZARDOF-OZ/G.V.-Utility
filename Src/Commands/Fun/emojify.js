const Discord = require('discord.js');
const config = require('../../../config.js');


module.exports = {
    
        name: 'emojify',  
     description: 'Emojifies your text message',
        aliases: ["emojify"],
        usage: '<text>',
        category: 'Fun',
    
    execute: async (client, message, args, text, instance) => {
        const errEmbed = new Discord.MessageEmbed()
    .setColor(instance.color.error)
        if(!args[0]) {
			return message.channel.send(errEmbed
                .setDescription(`${instance.emoji.error} Please provide valid text.`,
            ));
		}

		const specialChars = {
			'0': ':zero:',
			'1': ':one:',
			'2': ':two:',
			'3': ':three:',
			'4': ':four:',
			'5': ':five:',
			'6': ':six:',
			'7': ':seven:',
			'8': ':eight:',
			'9': ':nine:',
			'#': ':hash:',
			'*': ':asterisk:',
			'?': ':grey_question:',
			'!': ':grey_exclamation:',
			' ': '   ',
		};
const errEmbed2 = new Discord.MessageEmbed()
.setColor(instance.color.error)
		const emojified = `${args.join(' ')}`.toLowerCase().split('').map(letter => {
			if (/[a-z]/g.test(letter)) {
				return `:regional_indicator_${letter}: `;
			}
			else if (specialChars[letter]) {
				return `${specialChars[letter]} `;
			}
			return letter;
		}).join('');

		if(emojified.length > 2000) {
			return message.channel.send(errEmbed2.setDescription(`${instance.emoji.error} The emojified message exceeds 2000 characters.`));
		}

		message.channel.send(emojified);

    }
};