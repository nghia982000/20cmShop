const Account = require('../models/Account')
const jwt= require('jsonwebtoken')

class CartController {
    //[GET] /cart
    cart(req,res,next) {
        const product=req.data.cart
        const total=product.reduce((total,item)=>{
            return total+((item.quatity)*(item.price))
        },0)
        res.render('cart/cart',{
            product:product,
            total:total,
            shippingFee:total+0,
        })
    }
    //[patch]/delete
    deleteCart(req, res, next) {
        const token=req.cookies.token
        var idUser=jwt.verify(token,'mk')
        Account.findOne({
            _id:idUser,
        })
        .then(data=>{
            //data.cart.splice(req.body.index,1)

            Account.updateOne({_id:idUser},{
                $pull:{
                    cart:{
                        id:req.body.index
                    }
                }
            })
            .then(data=>{
                res.json(data)
            })
        })
    }
    //[GET] /cart/order
    order(req, res) {
        const product=req.data.cart
        const total=product.reduce((total,item)=>{
            return total+((item.quatity)*(item.price))
        },0)
        res.render('cart/order',{
            product:product,
            total:total,
            shippingFee:total+0,
        })
    }
    //midleware kiểm tra đăng nhập
    checkLogin(req, res,next){
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
                res.send('lỗi')
            })
        }
        catch(err){
            res.status(500).redirect('/account/formLogin')//token ko hợp lệ quay lại đăng nhập
        }
    }
    //[post]/cart/infoOrder
    infoOrder(req, res){
        const token=req.cookies.token
        var idUser=jwt.verify(token,'mk')
        Account.findOne({
            _id:idUser
        })
        .then(cart=>{
            const order={
                info:req.body,
                cart:cart.cart,
                id:cart._id
            }
            Account.updateOne({_id:idUser},{
                $set:{
                    cart:[]
                }
            })
            .then(()=>{
                Account.updateOne({_id:idUser},{
                    $push:{
                        order:{
                            idUser:order.id,
                            time:order.info.time,
                            status:order.info.status,
                            code:order.info.code,
                            info:order.info.data,
                            cart:order.cart
                        }
                    }
                })
                .then((data)=>{
                    res.json(data)
                })
                .catch(err=>{
                    res.send(err)
                })
            })
            .catch(err=>{
                res.send(err)
            })

        })
        .catch(err=>{
            res.send(err)
        })
    }
    //[get]/detailOrder/:code
    detailOrder(req, res) {
        try{
            const token=req.cookies.token
            var idUser=jwt.verify(token,'mk')
            Account.findOne({
                _id:idUser
            })
            .then(data=>{
                const orders=data.order
                const code=req.params.code
                const order=orders.find((item)=>{
                    return item.code===code
                })
                res.render('cart/detailOrder',{order})
            })
            .catch(err=>{
                res.send('lỗi')
            })
        }
        catch(err){
            res.status(500).redirect('/account/formLogin')//token ko hợp lệ quay lại đăng nhập
        }
    }
    //[delete]/deleteOrder
    deleteOrder(req, res) {
        try{
            const token=req.cookies.token
            var idUser=jwt.verify(token,'mk')
            Account.findOne({
                _id:idUser
            })
            .then(()=>{
                Account.updateOne({_id:idUser},{
                    $pull:{
                        order:{
                            code:req.body.code
                        }
                    }
                })
                .then(data=>{
                    res.json(data)
                })
            })
            .catch(err=>{
                res.send('lỗi')
            })
        }
        catch(err){
            res.status(500).redirect('/account/formLogin')//token ko hợp lệ quay lại đăng nhập
        }
    }
}

module.exports = new CartController()
