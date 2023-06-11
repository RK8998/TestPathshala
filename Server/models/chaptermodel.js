const mongoose = require('mongoose');

const chapterSchema = mongoose.Schema({
    cid:{
        type:String,
        required:true
    },
    chname:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('chapter',chapterSchema)

