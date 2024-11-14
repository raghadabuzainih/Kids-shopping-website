const mongoose = require('mongoose')
const express = require('express')
const app = new express()
const router = require('./routes/router')
const cookieParser = require('cookie-parser')
const {checkUser} = require('./middleware/middleware')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))  //includes css, images, JSON file
app.set('view engine', 'ejs')
app.use(cookieParser())

const dbURI = 'mongodb+srv://[username]:[password]@cluster0.5j4sjdd.mongodb.net/[dbname]?retryWrites=true&w=majority';
mongoose.connect(dbURI)
.then(result => app.listen(3000))
.catch(err => console.log(err))

app.get('*', checkUser)
app.get('/', (req, res)=> res.render('home', {titleName : 'Kids Shopping Website'}))
app.use(router)