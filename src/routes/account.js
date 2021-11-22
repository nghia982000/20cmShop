const express= require('express')
const router= express.Router()
const accountController= require('../app/controllers/AccountController')

router.get('/formForgotPassword',accountController.formForgotPassword)
router.post('/forgotPassword',accountController.forgotPassword)

router.get('/formRegister',accountController.formRegister)
router.get('/formLogin',accountController.formLogin)
router.post('/formLogin',accountController.login)
router.post('/formRegister',accountController.register)

router.post('/updateInfo',accountController.updateInfo)
router.post('/updatePassword',accountController.updatePassword)

router.post('/updateQuatity',accountController.updateQuatity)

router.get('/',accountController.protect,accountController.account)

module.exports =router