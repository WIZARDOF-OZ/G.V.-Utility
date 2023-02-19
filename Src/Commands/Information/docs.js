const db = require("old-wio.db");
const axios = require("axios");

module.exports = {
  
  name: 'docs',
  category: 'Information',
  aliases: ["docs","djs"],
  description: 'Displays Discord.JS documentation',
  usage: "djsdocs <query>",
  
  execute: async (client, message, args) => {
   const uri = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
      args
    )}`

    axios
      .get(uri)
      .then((embed) => {
        const { data } = embed

        if (data && !data.error) {
          message.channel.send({ embed: data })
        } else {
          message.reply('Could not find that documentation')
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }
}