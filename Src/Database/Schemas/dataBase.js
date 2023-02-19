const mongoose = require('mongoose');
const moment = require("moment");

const DataBase = new mongoose.Schema({
    officialClubs: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('database', DataBase);