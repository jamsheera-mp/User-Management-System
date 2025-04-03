

const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const cors = require('cors')
 
const app = express()
connectDB()

app.use(
    cors({
      origin: "http://localhost:5173", // Allow frontend URL
      credentials: true, // Allow cookies and headers
    })
  );

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const path = require('path')
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.use('/api/users',userRoutes)
app.use('/api/admin',adminRoutes)


const port = process.env.PORT || 3000
 app.listen(port,()=>{
    console.log(`Server running on port ${port} `)
 }).on('error',(err)=>{
    if(err.code === 'EADDRINUSE'){
        console.log(`port ${port} is in use.Trying another port...`);
        app.listen(0,()=>console.log(`Server running on a different port.`))    
    }else{
        console.error(err);
        
    }
 });