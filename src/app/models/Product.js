const mongoose = require('mongoose')
const Schema=mongoose.Schema

const Product = new Schema({
    name: {type: String,},
    price: {type: Number,},
    image: [{type:String}],
    quatity: {type: Number,},
    status:{type: String,},
    level:{type: String,},
    trademark:{type:String,},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    description: {
      type: Object,
      overview: {type: String},
      detail: {type: Array},
    },
    evaluate:[{
      type: Object,
      name:{type: String,},
      email:{type: String,},
      comment:{type: String,},
      star: {type:Array},
      status:{type: String},
    }]
  })
Product.index({
  trademark:'text',
})

module.exports = mongoose.model('Product', Product)
