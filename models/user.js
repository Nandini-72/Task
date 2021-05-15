const mongoose = require('mongoose')
const schema = mongoose.Schema
const userSchema = new mongoose.Schema({
    first_name:{
        type:String
    },
    last_name:{
        type:String
    },
    email:{
        type:String
    },
    contact:{
        type:Number
    }
})
module.exports = mongoose.model('User',userSchema)