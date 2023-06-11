const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    uid:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    cid:{
        type:String,
        required:true
    },
    msg:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('chat',chatSchema)

