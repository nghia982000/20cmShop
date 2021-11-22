const path = require('path')
const express = require('express')
const morgan = require('morgan')
const handlebars= require('express-handlebars')
const app = express()
const port =process.env.PORT || 3000
const route = require('./routes')
const db = require('./config/db')
//cookie
const cookieParser = require('cookie-parser')

app.use(cookieParser())

//connect to db
db.connect()

//static files
app.use(express.static(path.join(__dirname, 'public')))

// middleware
 app.use(express.urlencoded({
   extended:true
 }))
 app.use(express.json())

// HTTP loger
app.use(morgan('combined'))

//Template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers:{
    formatNumber: function(num){
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    },
    totalProduct: function(price,quantity){
      return (price*quantity).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    },
    totalProductOrder:function(product){
      return (
        product.reduce((total,item)=>{
          return total+((item.quatity)*(item.price))
        },0)+99999
      ).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    },
    conver:function(arr) {
      return (arr)?(arr.length):0
    },
    converArraytoString:function(arr,index){
      return arr[index]
    },
    formatDatetime:function(Datetime){
      var date = new Date(Datetime)
      return (`${date.getDate()} tháng ${date.getMonth()+1}, ${date.getFullYear()}`)
    }
  }
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources','views'))

//router init
route(app)


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})