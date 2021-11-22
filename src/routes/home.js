const express= require('express')
const router= express.Router()
const homeController= require('../app/controllers/HomeController')

router.post('/tabLevel',homeController.tabLevel)
router.get('/',homeController.home)


module.exports =router