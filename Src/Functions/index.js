const inlineReply = require("./Addon/Inline-replies");
const checkHardmutes = require("./Workers/checkHardmutes");

const giveaways = require("./Addon/Giveaways");
const paginate = require("./Addon/Pagination/Page");
const logErrors = require("./Base/logErrors");
const statusChange = require("./Addon/Status");
const verifyCollector = require("./Workers/Collectors/Verify");

async function loadAll(client) {
    inlineReply;
    checkHardmutes(client);
   

    client.giveaways = giveaways(client);
    paginate(client);
    logErrors(client);
    statusChange(client);
    verifyCollector(client);
    return true;
}

module.exports = loadAll;