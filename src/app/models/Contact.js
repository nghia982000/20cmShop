const mongoose = require('mongoose')
const Schema=mongoose.Schema

const Contact = new Schema({
    name:{type:String},
    email:{type:String},
    phoneNumber:{type:String},
    address:{type:String},
    message:{type:String}
  },{timestamps:true})

module.exports = mongoose.model('Contact', Contact)