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

// CORS
// var whitelist = ['http://https://platform-pejabat.vercel.app/#/login.com', 'https://platform-pejabat.vercel.app/#/register']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }


// Connect DB
mongoose.connect(process.env.DB_CONNECT, 
    { useNewUrlParser:true}, () =>
    console.log('connected to db !')
)

// Middleware
app.use(express.json())
app.use(cors())
app.use((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET','POST','PUT','PATCH','DELETE');
  res.setHeader('Access-Control-Allow-Headers','X-PINGOTHER','Content-Type')
  res.setHeader('Access-Control-Max-Age','86400')
  
})
// implement cors here
// app.use(cors(corsOptions))
// Route Middlewares

app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen(PORT, () => console.log('Server Up and running '))


