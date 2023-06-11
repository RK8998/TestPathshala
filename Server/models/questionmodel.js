const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    tid:{
        type:String,
        required:true
    },
    question:{
        type:String,
        required:true
    },
    option:{
        A:{
            type:String,
            required:true
        },
        B:{
            type:String,
            required:true
        },
        C:{
            type:String,
            required:true
        },
        D:{
            type:String,
            required:true
        },
    },
    answer:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('question',questionSchema)

