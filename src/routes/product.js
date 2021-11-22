const express= require('express')
const router= express.Router()
const productController= require('../app/controllers/ProductController')

router.post('/addToCart',productController.addToCart)
router.post('/arrangeProduct',productController.arrangeProduct)
router.get('/:_id',productController.detail)
router.post('/comment',productController.comment)
router.post('/',productController.search)
router.get('/',productController.product)


module.exports =router