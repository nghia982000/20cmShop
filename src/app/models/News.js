const mongoose = require('mongoose')
const Schema=mongoose.Schema

const News = new Schema({
    title:{type:String},
    header:{type:String},
    body:{type:String},
    end:{type:String},
    picture:[{type:String}],
  },{timestamps:true})

module.exports = mongoose.model('News', News)