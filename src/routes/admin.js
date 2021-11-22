const express= require('express')
const router= express.Router()
const adminController= require('../app/controllers/AdminController')
//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/public/img')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({storage: storage})

//quản lý tin tức
router.post('/editNews/:id',upload.array('imageNews',12),adminController.editNewsDb)
router.get('/news',adminController.checkLogin,adminController.news)
router.get('/editNews/:id',adminController.checkLogin,adminController.editNews)
router.delete('/deleteNews/:id',adminController.deleteNews)
router.post('/news',upload.array('imageNews',12),adminController.addNewsDb)
//câu hỏi từ khách hàng
router.get('/contact',adminController.checkLogin,adminController.contact)
router.post('/deleteContact',adminController.deleteContact)
//admin Quản lý người dùng
router.get('/users',adminController.checkLogin,adminController.users)
router.post('/users',adminController.viewUser)
router.delete('/users',adminController.deleteUser)
//admin quản lý đơn hàng
router.get('/order',adminController.checkLogin,adminController.order)
router.get('/detailOrder/:code',adminController.checkLogin,adminController.detailOrder)
router.post('/updateOrder',adminController.updateOrder)
router.post('/deleteOrder',adminController.deleteOrder)
//Quản lý đánh giá
router.post('/deleteEvaluate',adminController.deleteEvaluate)
router.post('/browseEvaluate',adminController.browseEvaluate)
router.get('/evaluateProduct/:id',adminController.checkLogin,adminController.evaluateProduct)
//Quản lý sản phẩm
router.get('/product',adminController.checkLogin,adminController.product)
//chỉnh sửa sản phẩm
router.get('/editProduct/:id',adminController.checkLogin,adminController.editProduct)
router.post('/editProduct/:id',upload.array('imageProduct',12),adminController.editProductDb)
//xóa sản phẩm
router.delete('/deleteProduct/:id',adminController.deleteProduct)
//thêm sản phẩm
router.post('/product',upload.array('imageProduct',12),adminController.addProductDb)
//Đăng nhập trang quản trị
router.get('/login',adminController.formLogin)
router.post('/login',adminController.login)
//Quản lý tài khoản admin
router.get('/account',adminController.checkLogin,adminController.account)
router.post('/password',adminController.password)
//trang thống kê
router.get('/statistical',adminController.statistical)
//trang cài đặt
router.get('/setting',adminController.setting)
//admin trang chủ
router.get('/',adminController.checkLogin,adminController.admin)


module.exports =router
