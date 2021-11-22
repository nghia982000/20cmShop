const Product = require('../models/Product')
const Account = require('../models/Account')
const Contact = require('../models/Contact')
const Admin = require('../models/Admin')
const News = require('../models/News')
const jwt= require('jsonwebtoken')
const { multipleMongooseToObject } = require('../../util/mongoose')
const { mongooseToObject } = require('../../util/mongoose')
const { render } = require('sass')

class AdminController {
    
    //[get]/login
    formLogin(req, res, next) {
        res.render('admin/login',{layout:false})
    }
    //[post]/login
    login(req, res, next) {
        const username=req.body.userName
        const password=req.body.password
        const email=req.body.email
        Admin.findOne({
            userName:username,
            password:password,
            email:email,
        })
        .then(data=>{
            // console.log(data)
            if(data){
                const tokenAdmin = jwt.sign({
                    _id:data._id
                },'admin')
                res.json({
                    tokenAdmin:tokenAdmin,
                    success:1//đã đăng nhập thành công
                })
                
            }
            else{
                res.status(300).json({success:0})//sai tài khoản hoặc mật khẩu
            }
        })
        .catch(err=>{
            res.json('Có lỗi bên server')
        })
    }
    checkLogin(req, res,next){
        try{
            const tokenAdmin=req.cookies.tokenAdmin
            var idUser=jwt.verify(tokenAdmin,'admin')
            Admin.findOne({
                _id:idUser
            })
            .then(data=>{
                if(data){
                    next()
                }
                else{
                    res.json('no permisson')
                }
            })
            .catch(err=>{
                res.send('lỗi')
            })
        }
        catch(err){
            res.status(500).redirect('/admin/login')//token ko hợp lệ quay lại đăng nhập
        }
    }

    //[GET] /product(admin)
    product(req, res) {
        Product.find({})
            .then(function(product) {
                res.render('admin/product',{
                    product: multipleMongooseToObject(product),
                    layout:false
                })
            })
            .catch(function(error) {
                next(error)
            })
    }
    //[get]/
    admin(req, res, next){
        res.render('admin/admin',{layout:false})
    }
    //[get]/editProduct/:id
    editProduct(req, res, next){
        Product.findOne({
            _id: req.params.id
        })
        .then(product => {
            const detail=product.description.detail.join('\n')
            res.render('admin/editProduct',{
                product:mongooseToObject(product),
                detail:detail,
                layout:false
            })
        })
        .catch(function(error) {
            next(error)
        })
        
    }
    //[POST]/editProduct/:id
    editProductDb(req, res){
        const overview=req.body.overviewProduct
        const detail=req.body.detailProduct
        var image=(req.body.urlImage)
        let newFiles=[]
        if(typeof image === 'undefined'){
            newFiles=req.files.reduce((arr,item) => {
                return arr.concat(`/img/${item.filename}`)
            },[])
        }
        else{
            newFiles=image.split(',')
        }
        const data={
            name: req.body.nameProduct,
            price: req.body.priceProduct,
            status:req.body.statusProduct,
            quatity:req.body.quatityProduct,
            trademark:req.body.trademarkProduct,
            level:req.body.levelProduct,
            image:newFiles,
            description:{
                overview:overview ,
                detail: detail.split('\r\n')
            }
        }
        Product.updateOne({_id: req.params.id},data)
        .then(()=>res.redirect('/admin/product'))
        .catch((err)=>{
            res.send('lỗi')
        })
    }
    //[delete]/removeProduct/:id
    deleteProduct(req, res, next){
        Product.deleteOne({_id: req.body.id})
            .then(data=>res.json(data))
            .catch(err=>next(err))

    }
    //[POST]/addProduct
    addProductDb(req, res){
        const overview=req.body.overviewProduct
        const detail=req.body.detailProduct
        const files=req.files
        let newFiles=[]
        newFiles=files.reduce((arr,item) => {
            return arr.concat(`/img/${item.filename}`)
        },[])
        const data={
            name: req.body.nameProduct,
            price: req.body.priceProduct,
            status:req.body.statusProduct,
            quatity:req.body.quatityProduct,
            trademark:req.body.trademarkProduct,
            level:req.body.levelProduct,
            image:newFiles,
            description:{
                overview:overview ,
                detail: detail.split('\r\n')
            }
        }
        const product=new Product(data)
        product.save()
        .then(() =>res.redirect('/admin/product'))
        .catch((err)=>{
            res.send('lỗi')
        })
    }
    //[get]/users
    users(req, res,next){
        Account.find({})
        .then(account=>{
            // res.json(account)
            res.render('admin/users',{
                account:multipleMongooseToObject(account),
                layout:false
            })
        })
        .catch((err)=>{
            res.send('lỗi')
        })
    }
    //[post]/users
    viewUser(req,res,next){
        Account.findOne({
            _id:req.body.id
        })
        .then(data=>{
            res.json(data)
        })
        .catch(err=>{
            res.send('lỗi')
        })
    }
    //[delete]/users
    deleteUser(req,res,next){
        Account.deleteOne({_id: req.body.id})
            .then(data=>res.json(data))
            .catch(err=>next(err))
    }
    //[get]/order
    order(req,res){
        Account.find({})
        .then((data)=>{
            var newOrder=data.reduce((order,account)=>{
                return order.concat(account.order)
            },[])
            res.render('admin/orders',{
                newOrder: newOrder,
                layout:false,
            })
        })
        .catch((error)=>{
            res.send('lỗi')
        })
    }
    //[get]/detailOrder/:code
    detailOrder(req, res){
        Account.find({})
        .then((data)=>{
            var newOrder=data.reduce((order,account)=>{
                return order.concat(account.order)
            },[])
            const order=newOrder.find((item)=>{
                return item.code==req.params.code
            })
            res.render('admin/detailOrder',{
                order: order,
                layout:false,
            })
        })
        .catch((error)=>{
            res.send('lỗi')
        })
    }
    //[post]/updateOrder
    updateOrder(req, res, next){
        Account.updateOne({_id:req.body.idUser,"order.code":req.body.code},{
            $set:{
                "order.$.status":req.body.status
            }
        })
        .then(data=>{
            res.json(data)
        })
        .catch(error=>{
            res.send(error)
        })
    }
    //[post]/deleteOrder
    deleteOrder(req, res, next){
        Account.updateOne({_id:req.body.idUser},{
            $pull:{
                order:{
                    code:req.body.code
                }
            }
        })
        .then(data=>{
            res.json(data)
        })
        .catch(err=>{
            res.send('lỗi')
        })
       
    }
    //[get]/evaluateProduct
    evaluateProduct(req, res, next){
        const id = req.params.id
        Product.findOne({_id: id})
        .then(product =>{
            res.render('admin/evaluateProduct',{
                layout:false,
                evaluate:product.evaluate,
                idProduct:product._id,
                nameProduct:product.name
            })
        })
        .catch(error=>{
            res.send(error)
        })

    }
    //[post]/browseEvaluate
    browseEvaluate(req, res, next){
        const idProduct =req.body.idProduct
        const idEvaluate =req.body.idEvaluate
        Product.updateOne({_id:idProduct,"evaluate.id":idEvaluate},{
            $set: {
                "evaluate.$.status":req.body.status
            }
        })
        .then(data=>{
            res.json(data)
        })
        .catch(error=>{
            res.send(error)
        })
    }
    //[post]/deleteEvaluate
    deleteEvaluate(req, res, next){
        const idProduct =req.body.idProduct
        const idEvaluate =req.body.idEvaluate
        Product.updateOne({_id:idProduct},{
            $pull:{
                evaluate:{
                    id:idEvaluate
                }
            }
        })
        .then(data=>{
            res.json(data)
        })
        .catch(err=>{
            res.send('lỗi')
        })
    }
    //[get]/contact
    contact(req, res){
        Contact.find({})
            .then(function(contact) {
                res.render('admin/contact',{
                    contact: multipleMongooseToObject(contact),
                    layout:false
                })
            })
            .catch(function(error) {
                next(error)
            })
    }
    //[post]/deleteContact
    deleteContact(req, res) {
        Contact.deleteOne({_id: req.body.id})
            .then(data=>res.json(data))
            .catch(err=>next(err))
    }
    //[get]/news
    news(req, res) {
        News.find({})
            .then(function(news) {
                res.render('admin/news',{
                    news: multipleMongooseToObject(news),
                    layout:false
                })
            })
            .catch(function(error) {
                next(error)
            })
    }
    //[post]/addNewsDb
    addNewsDb(req, res){
        const files=req.files
        let newFiles=[]
        newFiles=files.reduce((arr,item) => {
            return arr.concat(`/img/${item.filename}`)
        },[])
        const data={
            title:req.body.title,
            header:req.body.header,
            body:req.body.body,
            end:req.body.end,
            picture:newFiles
        }
        const news=new News(data)
        news.save()
        .then(() =>res.redirect('/admin/news'))
        .catch((err)=>{
            res.send('lỗi')
        })

    }
    //[delete]/deleteNews
    deleteNews(req, res){
        News.deleteOne({_id: req.params.id})
            .then(data=>res.json(data))
            .catch(err=>next(err))
    }
    //[get]/editNews/:id
    editNews(req, res){
        News.findOne({
            _id: req.params.id
        })
        .then(news => {
            res.render('admin/editNews',{
                news:mongooseToObject(news),
                layout:false
            })
        })
        .catch(function(error) {
            next(error)
        })
    }
    //[post]/editNewsDb/:id
    editNewsDb(req, res){
        var image=(req.body.urlImage)
        let newFiles=[]
        if(typeof image === 'undefined'){
            newFiles=req.files.reduce((arr,item) => {
                return arr.concat(`/img/${item.filename}`)
            },[])
        }
        else{
            newFiles=image.split(',')
        }
        const data={
            title:req.body.title,
            title:req.body.title,
            header:req.body.header,
            body:req.body.body,
            end:req.body.end,
            picture:newFiles
        }
        News.updateOne({_id: req.params.id},data)
        .then(()=>res.redirect('/admin/news'))
        .catch((err)=>{
            res.send('lỗi')
        })
    }
    //[get]/account
    account(req,res){
        res.render('admin/account',{layout:false})
    }
    //[post]password
    password(req, res){
        Admin.updateOne({
            userName:req.body.userName,
            email:req.body.email,
            password:req.body.password,
        },{
            $set: {
                password:req.body.newPassword
            }
        })
        .then(data=>{
            res.json(data)
        })
        .catch((err)=>{
            res.send('lỗi')
        })
    }
    //[get]/statistical
    statistical(req, res){
        res.render('admin/statistical',{layout:false})
    }
    //[get]/setting
    setting(req, res){
        res.render('admin/setting',{layout:false})
    }
}

module.exports = new AdminController()