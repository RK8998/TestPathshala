const mongoose = require('mongoose')

const enrollSchema = mongoose.Schema({
    uid:{
        type:String,
        required:true
    },
    cid:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('enroll',enrollSchema);