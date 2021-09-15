const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    email:{
        type: String,
        required: true,
        max : 255
    },
    password:{
        type: String,
        required: true,
        min: 8,
        max: 24
    },
    Date : {
        type : Date,
        default : Date.now
    }
})


module.exports = mongoose.model('User', userSchema)