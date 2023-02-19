const mongoose = require("mongoose");

const hardmuteSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    responsibleUser: {
        type: String,
        required: true
    },
    mutedOn: {
        type: String,
        required: false,
        default: new Date().toISOString()
    },
    mutedTill: {
        type: String,
        required: true
    },
    roles: {
        type: Array,
        required: false,
        default: []
    }
})
const name = 'hardmute'
module.exports = mongoose.model(name, hardmuteSchema)