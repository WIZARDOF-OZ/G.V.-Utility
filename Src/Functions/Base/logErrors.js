const { Collection } = require("discord.js");

module.exports = (client) => {

    client.errors = new Collection();

    process.on("unhandledRejection" , (e) => {
        client.errors.set(new Date().toISOString() , e);
        console.log(e)
    });
}