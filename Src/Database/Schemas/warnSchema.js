const mongoose = require("mongoose");

const warnSchema = new mongoose.Schema({
    id : {
        type: String,
        required : true
    },
    warnings: {
        type : Array,
        required: false,
        default : []
    },
    lastUpdated: {
        type : String,
        required: false,
        default : new Date().toISOString()
    }
})
const name = 'warning'
module.exports = mongoose.model(name, warnSchema)


/* Data Structure
 {
     type: 1, //1 = user | 2 = auto mod (black list words) | 3 = auto mod (anti spam)
     id: "", //Unique ID
     reason: "",
     responsibleUser: "",
     time: "ISO String"
 }

*/