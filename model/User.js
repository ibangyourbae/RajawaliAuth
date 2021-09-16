const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        max : 255
    },
    username:{
        type:String,
        required: true,
        max : 16
    },
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