

const User = require('../models/User')

const isAdmin = async (req,res,next) => {
    try {
        const user = await User.findById(req.user.id)
        if(!user || !user.isAdmin){
            return res.status(403).json({message:'Acess denied.Admins only'})
        }
        next()
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = isAdmin