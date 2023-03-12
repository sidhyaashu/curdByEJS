const router = require('express').Router()
const User = require('../models/userM.js')
const multer = require('multer')
const fs = require('fs')

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
router.post('/add',upload,async(req,res)=>{
    const { email ,name,phone } = req.body


    try {
    const existUser = await User.findOne({email})
    if(existUser) {
        // res.status(200).json({message:"User already exist"})
        req.session.message={
            type:'danger',
            message:"User Already Exist"
        }
        res.redirect('/add')
    }

    const userObj={
        name,
        email,
        phone,
        image:req.file.filename
    }

    const user = await User.create(userObj)

    console.log(user)

    if(!user){
        res.status(400).json({ message:"User not created", type:"danger" })
    }else{
        req.session.message ={
            type:'success',
            message:'User added successfully'
        }
        res.redirect('/');
    }

    } catch (error) {
        console.log(error)
    }
})

//Get all user 
router.get('/',async(req,res)=>{
    try {
        const getAllUsers = await User.find({})
    if(getAllUsers){
        res.render('index',{
            title:'Home Page',
            users:getAllUsers
        })
    }else{
       res.json({message:err.message}) 
    }
    } catch (error) {
       res.json({message:"Problem on get all users"})  
    }
    
})

router.get('/add',(req,res)=>{
    res.render('add_user',{title:'Add User'})
})

router.get('/edit/:id',async(req,res)=>{
    const id = req.params.id
    try {
        const findUser = await User.findById(id)
        // if(findUser ==null) return res.redirect('/')

        if(findUser){
            res.render('edit_user',{
                title:"Edit User",
                user:findUser
            })
        }else{
            res.redirect('/')
        }
    } catch (error) {
        
    }
})

router.post('/update/:id',upload,async(req,res)=>{
    const id = req.params.id
    let new_image = ''
    const {old_image} = req.body
    // console.log("old image ------> ",old_image)

    if(req.file){
        new_image = req.file.filename
        try{
            await fs.unlinkSync("./uploads/"+req.body.old_image)
        }catch(err){
            console.log(err)
        }
    }else{
        new_image = req.body.old_image
    }
        const updateObj ={
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            image:new_image
        }
        const updatedUser = await User.findByIdAndUpdate(id,updateObj)

        if(updatedUser){
                req.session.message={
                    type:'success',
                    message:"User update succesfully"
                }
                res.redirect('/')
        }else{
            res.json({message:err.message,type:'danger'})
        }
})

router.get("/delete/:id",async(req,res)=>{
    const id = req.params.id

    const user = await User.findByIdAndRemove(id)

    try {
        if(user.image !=''){
        try{
            fs.unlinkSync('./uploads/'+user.image)
        }catch(err){
            console.log(err)
        }

        if(user.$isEmpty){
            req.session.message={
                type:"info",
                message:"User Deleted"
            }
        }
        res.redirect('/')
    }
    } catch (error) {
        console.log(error)
    }

})

module.exports = router


// (err,result)=>{
//             if(err){
//                 res.json({message:err.message,type:'danger'})
//             }else{
//                 req.session.message={
//                     type:'success',
//                     message:"User update succesfully"
//                 }
//                 res.redirect('/')
//             }
//         }


// router.get('/',async(req,res)=>{
//     await User.find().exec((err,users)=>{
//         if(err){
//             // res.json({message:err.message})
//             res.json({message:"Can't get data"})
//         }else{
//             res.render('index',{
//                 title:"Home Page",
//                 users:users
//             })
//         }
//     })
    
// })