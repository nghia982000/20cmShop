const Account = require('../models/Account')
const jwt= require('jsonwebtoken')
const { mongooseToObject } = require('../../util/mongoose')
class AccountController {
    
    //[GET] /formregister
    formRegister(req, res) {
        res.render('account/register')
    }
    //[GET] /formlogin
    formLogin(req, res) {
        res.render('account/login')
    }
    //[POST] /register
    register(req, res) {
        const username = req.body.userName
        const account =new Account(req.body)
        Account.findOne({
            userName: username
        })
        .then(data=>{
            if(data){
                res.json({
                    success:0//tài khoản đã tồn tại
                })
            }
            else{
                return account.save()
            }
        })
        .then(data=>{
            res.json({
                success:1//tạo tài khoản thành công
            })
        })
        .catch(err=>{
            res.status(500).json({
                success:2//tạo tài khoản thất bại
            })
        })
        // const account =new Account(req.body)
        // account.save()
        //     .then(()=> res.redirect('/account'))
        //     .catch(error=>{

        //     })
    }
     //[POST] /login
    login(req, res){
        const username=req.body.userName
        const password=req.body.password
        Account.findOne({
            userName:username,
            password:password,
        })
        .then(data=>{
            if(data){
                const token = jwt.sign({
                    _id:data._id
                },'mk')
                res.json({
                    token:token,
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
    //[GET]/protect
    protect(req, res,next){
        try{
            const token=req.cookies.token
            var idUser=jwt.verify(token,'mk')
            Account.findOne({
                _id:idUser
            })
            .then(data=>{
                if(data){
                    req.data=data//gán dữ liệu cho req của midleware sau
                    next()
                }
                else{
                    res.json('no permisson')
                }
            })
            .catch(err=>{

            })
        }
        catch(err){
            res.status(500).redirect('/account/formLogin')//token ko hợp lệ quay lại đăng nhập
        }
    }
    //[GET] /account
    account(req, res) {
        const info=req.data
        res.render('account/account',{
            info:mongooseToObject(info)
        })
    }
    //[post]/updateInfo
    updateInfo(req, res) {
        // res.json(req.body)
        const token=req.cookies.token
        var idUser=jwt.verify(token,'mk')
        Account.findOne({
            _id:idUser,
        })
        .then(()=>{
            //data.cart.splice(req.body.index,1)
            // res.send(data)
            Account.updateOne({_id:idUser},{
                $set:{
                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    email:req.body.email,
                    phoneNumber:req.body.phoneNumber,
                }
            })
            .then(data=>{
                res.json(data)
            })
        })
    }
    //[post]/updatePassword
    updatePassword(req, res){
        const passwordOld = req.body.passwordOld
        const passwordNew = req.body.passwordNew
        const token=req.cookies.token
        var idUser=jwt.verify(token,'mk')
        Account.findOne({
            _id:idUser,
        })
        .then((data)=>{
           
            if(passwordOld===data.password){
                Account.updateOne({_id:idUser},{
                    $set:{
                        password:passwordNew,
                    }
                })
                .then(data=>{
                    res.json({
                        error:false,
                    })
                })
            }
            else{
                res.json({
                    error:true,
                })
            }
        })
        .catch(err=>{
            res.send('lỗi')
        })
    }
    //[post]/updateQuatity
    updateQuatity(req, res){
        const token=req.cookies.token
        const idUser=jwt.verify(token,'mk')
        Account.findOne({
            _id:idUser,
        })
        .then(data=>{
            Account.updateOne(
                { _id:idUser,"cart.id":req.body.id},
                {$set:{"cart.$.quatity":req.body.quatity}}
            )
            .then(data=>{
                res.json(data)
            })
        })
    }
    //[get]/formForgotPassword
    formForgotPassword(req, res){
        res.render('account/forgotPassword')
    }
    //[post]/forgotPassword
    forgotPassword(req, res){
        Account.updateOne({
            userName:req.body.userName,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber
        },{
            $set:{
                password:req.body.password
            }
        })
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            res.json({error:err})
        })
    }
}

module.exports = new AccountController()
