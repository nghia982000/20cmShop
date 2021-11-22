const Product = require('../models/Product')
const News = require('../models/News')
const { multipleMongooseToObject } = require('../../util/mongoose')
class HomeContronller {
    //[GET] /home
    home(req, res,next) {
        const item = 'Bán chạy'
        Product.find({})
        .then((data) => {
            News.find({})
            .then(function(news) {
                var products=[]
                products=data.filter((product) => {
                    return product.level===item
                })
                res.render('home',{
                    products: multipleMongooseToObject(products),
                    news: multipleMongooseToObject(news)
                })
            })
            .catch(function(error) {
                next(error)
            })
        })
        .catch(function(error) {
            next(error)
        })
    }
    //[post]/tabLevel
    tabLevel(req,res){
        const item = req.body.item
        Product.find({})
        .then((data) => {
            var products=[]
            products=data.filter((product) => {
                return product.level===item
            })
            res.json(products)
        })
    }
}


module.exports = new HomeContronller;