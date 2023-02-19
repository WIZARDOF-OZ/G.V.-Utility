const mongoose = require('mongoose');
const officialClubs = mongoose.model('database');
const dbConfig = require("../../../../JSON/DataBase_Config.json");
const fetch = require("node-fetch");
const endpoint = "https://tke-general.screeneros.repl.co/api/club/";

async function fetchData() {
    const {officialClubs : allClubs} = await officialClubs.findById(dbConfig.Club_Overview)

    let pushOut = [];
    for (let i = 0; i < allClubs.length; i++) {
        const tClub = allClubs[i];
        const res = await fetchAPI(endpoint, tClub.tag)
        if (!res) return;
        pushOut.push(res);
    }
    const out = await pushOut.sort((a, b) => b.trophies - a.trophies);
    return out || [];
}

module.exports = fetchData;

async function fetchAPI(endpoint, tag) {
    try {
        const res = await fetch(endpoint + tag.replace("#", "")).then(x => x.json());
        if (!res.status) return false;
        if (!res.data) return false;
        return res.data
    } catch (e) {
        return false;
    }
}