const mongoose = require('mongoose')
const Schema=mongoose.Schema

const Account = new Schema({
    firstname:{type:String},
    lastname:{type:String},
    userName:{type:String},
    email:{type:String},
    phoneNumber:{type:String},
    password:{type:String},
    cart:[
      {
        type:Object,
        name: {type: String,},
        price: {type: Number,},
        image: {type: String,},
        id: {type:String,}
      }
    ],
    order:[{
      type:Object
    }],
  },{timestamps:true})

module.exports = mongoose.model('Account', Account)