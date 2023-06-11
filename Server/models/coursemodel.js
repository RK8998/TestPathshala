const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    cname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    rate:{
        type:Number,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    totalChapter:{
        type:Number,
        required:true
    },
    totalTime:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('course',courseSchema)

