const News = require('../models/News')
const { multipleMongooseToObject } = require('../../util/mongoose')
const { mongooseToObject } = require('../../util/mongoose')
class NewsController {
    //[GET] /news
    news(req, res) {
        News.find({})
            .then(function(news) {
                res.render('news/news',{
                    news: multipleMongooseToObject(news),
                })
            })
            .catch(function(error) {
                next(error)
            })
    }
    //[GET]/detailNews/:id
    detailNews(req, res) {
        News.findOne({_id: req.params.id})
        .then(data=>{
            res.render('news/detailNews',{
                data:mongooseToObject(data),
            })
        })
        .catch(function(error) {
            next(error)
        })
        
        

    
    }

}

module.exports = new NewsController()
