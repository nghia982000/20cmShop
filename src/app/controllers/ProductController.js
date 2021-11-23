const Product = require('../models/Product')
const Account = require('../models/Account')
const { multipleMongooseToObject } = require('../../util/mongoose')
const { mongooseToObject } = require('../../util/mongoose')
const jwt= require('jsonwebtoken')
class ProductController {
    //[GET] /product
    product(req, res) {
        Product.find({})
            .then(function(product) {
                const trademark=product.map((item)=>{
                    return item.trademark
                })
                var newTrademark=[]
                newTrademark=trademark.filter((item)=>{
                    return newTrademark.includes(item)?'':newTrademark.push(item)
                })
                res.render('product/product',{
                    product: multipleMongooseToObject(product),
                    trademark:newTrademark
                })
            })
            .catch(function(error) {
                next(error)
            })
    }

    //[GET] /detail
    detail(req, res,next) {
        Product.findOne({ _id:req.params._id})
            .then(function(product) {
                const evaluate=product.evaluate
                let newEvaluate=[]
                newEvaluate=evaluate.filter((item)=>{
                    return item.status==='Đã duyệt'
                })
                const sum=newEvaluate.reduce((sum,item)=>{
                    if(item.star){
                        return sum+item.star.length
                    }
                    else{
                        return sum+0
                    }

                },0)
                const avgStar=(sum)?sum/(newEvaluate.length):0
                res.render('product/detail',{
                    product:mongooseToObject(product),
                    evaluate:newEvaluate,
                    avgStar:avgStar.toFixed(1)
                })
            })
            .catch(function(error) {
                next(error)
            })
    }
    //[POST]/addtocart
    addToCart(req, res,next){
        const token=req.cookies.token
        var idUser=jwt.verify(token,'mk')
        Account.updateOne({_id:idUser},{
            $push:{
                cart:{
                    name:req.body.name,
                    price:req.body.price,
                    image:req.body.image,
                    quatity:req.body.quatity,
                    size:req.body.size,
                    id:req.body.id,
                }
            }
        })
        .then(data=>{
            res.json(data)
        })
        .catch(()=>{
            console.log('lỗi')
        })
    }
    //[POST]/product
    search(req, res,next){
        const item = req.body.item
        if(item){
            Product.find({$text:{$search:item}})
            .then(product=>{
                res.json(product)
            })
            .catch(err=>{
                res.status(500).send('lỗi server')
            })
        }
        else{
            Product.find({})
            .then(product => {
                res.json(product)
            })
            .catch(err => {
                res.status(500).send('lỗi server')
            })
        }
    }

    arrangeProduct(req,res){
        const item = req.body.item
        // console.log(item)
        Product.find({})
        .then((data) => {
            if(item==0){
                res.json(data)
            }
            if(item==1){
                let products=[]
                products=data.filter((product) => {
                    return product.level==='Mới về'
                })
                res.json(products)
            }
            if(item==2){
                let products=[]
                products=data.filter((product) => {
                    return product.level==='Bán chạy'
                })
                res.json(products)
            }
            if(item==3){
                data.sort((a,b) =>(a.price-b.price))
                res.json(data)
            }
            if(item==4){
                data.sort((a,b) =>(-(a.price-b.price)))
                res.json(data)
            }
        })
    }
    //[post]/comment
    comment(req, res){
        const uid = function(){
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        const idProduct = req.body.data.idProduct
        const data= req.body.data
        const star=Number.parseInt(data.evaluate)
        const newStar=[]
        for(let i=0; i< star;i++){
            newStar.push(1)
        }
        Product.updateOne({_id:idProduct},{
            $push:{
                evaluate:{
                    id:uid(),
                    name: data.name,
                    email: data.email,
                    comment: data.comment,
                    star:newStar,
                    status:'Chưa duyệt',
                }
            }
        })
        .then(data =>{
            res.json(data)
        })
    }

}


module.exports = new ProductController()