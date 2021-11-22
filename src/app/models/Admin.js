const mongoose = require('mongoose')
const Schema=mongoose.Schema

const Admin = new Schema({
    userName:{type:String},
    email:{type:String},
    password:{type:String}
  },{timestamps:true})

module.exports = mongoose.model('Admin', Admin)