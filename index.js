//================================================================IMPORT================================================================
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const dotenv = require('dotenv')



//=============================================================CONFIGARATION OF ENV=============================================================
dotenv.config()
const PORT = process.env.SERVER_PORT || 5000
const DB = process.env.MONGO_URL


//===============================================================MIDDLEWARE===============================================================
app.use(express.urlencoded({extended:false}))

app.use(express.json())

app.use(session({
    secret:"MySecretKey",
    saveUninitialized:true,
    resave:false
}))

app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next()
})

app.use(express.static('uploads'))

//==========================================================SET TEMPLETE ENGINES==========================================================
app.set('view engine','ejs')



//================================================================ROUTES================================================================
app.use('/',require('./routes/userR.js'))



//=============================================================CONNECTIONS=============================================================
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const DATA_BASE_CONNECTION = mongoose.connection
DATA_BASE_CONNECTION.on('error',(error)=>{
    console.log(error)
})

DATA_BASE_CONNECTION.once('open',()=>{
    app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
})