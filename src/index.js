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
  helpers:require('./helpers/handlebars')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources','views'))

//router init
route(app)


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})