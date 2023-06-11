const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    uid:{
        type:String,
        required:true
    },
    cid:{
        type:String,
        required:true
    },
    chid:{
        type:String,
        required:true
    },
    tid:{
        type:String,
        required:true
    },
    marks:{
        type:Number,
        required:true
    }, 
    totalmarks:{
        type:Number,
        required:true
    },
    percentage:{
        type:Number,
        required:true
    },
});

module.exports = mongoose.model('result',resultSchema)

