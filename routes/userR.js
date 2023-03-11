const router = require('express').Router()
const User = require('../models/userM.js')
const multer = require('multer')


//===========================================================Image upload===========================================================
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
    }
})

const upload = multer({
    storage:storage,
}).single('image')


//Insert an user to the database
router.post('/add',upload,(req,res)=>{
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.body.image
    })

    user.save((err)=>{
        if(err){
            res.json({message:err.message,type:'danger'})
        }else{
            req.session.message
        }
    })
})


router.get('/',(req,res)=>{
    res.render('index',{title:'Home Page'})
})

router.get('/add',(req,res)=>{
    res.render('add_user',{title:'Add User'})
})

module.exports = router


//10.09/27.58