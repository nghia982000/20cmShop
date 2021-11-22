const homeRouter = require('./home.js')
const productRouter = require('./product.js')
const contactRouter = require('./contact.js')
const accountRouter = require('./account.js')
const cartRouter = require('./cart.js')
const newsRouter = require('./news.js')
const adminRouter = require('./admin.js')
function route(app){
    app.use('/admin',adminRouter)
    app.use('/product',productRouter)
    app.use('/news',newsRouter)
    app.use('/contact',contactRouter)
    app.use('/account',accountRouter)
    app.use('/cart',cartRouter)
    app.use('/',homeRouter)

}


module.exports =route