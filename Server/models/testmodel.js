const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    cid:{
        type:String,
        required:true
    },
    chid:{
        type:String,
        required:true
    },
    tname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    totaltime:{
        type:Number,
        required:true
    },
    totalmarks:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('test',testSchema)

