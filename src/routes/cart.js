const express= require('express')
const router= express.Router()
const cartController= require('../app/controllers/CartController')

router.get('/order',cartController.checkLogin,cartController.order)
router.get('/detailOrder/:code',cartController.detailOrder)
router.post('/order',cartController.infoOrder)

router.delete('/deleteOrder',cartController.deleteOrder)

router.patch('/delete',cartController.deleteCart)
router.get('/',cartController.checkLogin,cartController.cart)



module.exports =router