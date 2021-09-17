const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const cors = require('cors')


dotenv.config()
// Import Routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const { post } = require('./routes/auth')


// Connect DB
mongoose.connect(process.env.DB_CONNECT, 
    { useNewUrlParser:true}, () =>
    console.log('connected to db !')
)

// Middleware
app.use(express.json())
app.use(cors())
app.use((req,res,next)=>{
  res.setHeader('Acces-Control-Allow-Origin','*');
  res.setHeader('Acces-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');
  next(); 
})

// Route Middlewares

app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen(PORT, () => console.log('Server Up and running '))
