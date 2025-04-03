const jwt = require('jsonwebtoken')
require('dotenv').config()

const validateToken = async (req,res,next) => {
    try {
        let token
        let authHeader = req.headers.authorization || req.headers.Authorization;
        if(authHeader && authHeader.startsWith("Bearer")){
            token = authHeader.split(" ")[1]
            console.log("token:",token);
            
            jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
                if(err){
                    return res.status(401).json({message:"User is not authorized"})
                }
                req.user = decoded.user  //Store user data in req.user
                console.log(decoded.user);
                
               next()
                
            })
        }else{
            return res.status(401).json({message:"No token,authorization denied"})
        }
    } catch (error) {
        console.erro(error);
        res.status(500).json({message:"Server error"})
        
    }
}

module.exports = validateToken