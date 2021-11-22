const express= require('express')
const router= express.Router()
const newsController= require('../app/controllers/NewsController')

router.get('/detailNews/:id',newsController.detailNews)
router.get('/',newsController.news)


module.exports =router