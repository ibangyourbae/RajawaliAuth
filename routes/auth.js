const router = require('express').Router()
// const bcrypt = require('bcryptjs/dist/bcrypt')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { route } = require('express/lib/application')
const User = require('../model/User')
const {registerValidation, loginValidation} = require('../routes/validation')
const { has } = require('@hapi/joi/lib/types/array')
const { valid } = require('@hapi/joi')

// REGISTER
router.post('/register',async(req,res) => {

    // VALIDATE USER DATA

    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Checking if the user is already in the database
    const emailExist = await User.findOne({email:req.body.email})
    if(emailExist) return res.status(400).send('Email already exists')

    // checking if the username is already in the database
    const usernameExist = await User.findOne({username:req.body.username})
    if(usernameExist) return res.status(400).send('Username already exists') 

    // Hash passwords
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)


    // Create a new user
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send({
            user: user._id,
            "message": "Register user berhasil",
            body:{
                "name": req.body.name,
                "username": req.body.username,
                "email": req.body.email,
                "password": hashedPassword
            }

        })
    }catch(err){
        res.status(400).send(err)
    }
})

// LOGIN
router.post('/login', async(req,res) =>{

    // VALIDATE USER DATA
    
    
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
 
        // Checking if the email exists
        const user = await User.findOne({email: req.body.email})
        if(!user) return res.status(400).send('Email is not found')
        // PASSWORD IS CORRECT
        const validPass = await bcrypt.compare(req.body.password, user.password )
        if(!validPass) return res.status(400).send('Invalid Password')

        // PASSWORD CONFIRMATION
        const confirmPass = await bcrypt.compare(req.body.password, user.password)
        if(!confirmPass) return res.status(400).send('Password is not same')

        // Create and assign a token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        // res.header('auth-token', token).send(token)
        res.send({
            user:user._id,
            "message":"Berhasil Login",
            body:{
                "email": req.body.email,
                "password": true
            },
            'auth-token': token
        })
              


        console.log('Logged in')
})
module.exports = router