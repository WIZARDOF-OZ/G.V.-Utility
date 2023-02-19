const fetchData = require("./fetchData");
const messageUpdater = require("./messageUpdater");
const embedBuilder = require("./embedBuilder");
const { options } = require("../../../../JSON/Club_Overview_Config.json");

async function updateOverview(client) {
    setInterval(async () => {
        try {
            const clubData = await fetchData();
            const buildEmbed = await embedBuilder(clubData, options)
            messageUpdater(buildEmbed, client);
        } catch (e) { console.log(e) }
    }, options.timeout * 1000);
}

module.exports = updateOverview;