

const mongoose = require('mongoose')

const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add the user name"],
        
        trim:true,
        minlenght:3,
        maxlength:20
    },
    email:{
        type:String,
        required:[true,"Please add the email"],
        unique:[true,"Email address already taken"],
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Please add the password"],
        minlength:6
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    profilePicture:{
        type:String,
        default:''
    }
},{
    timestamps:true
})

module.exports = mongoose.model('User',userSchema)