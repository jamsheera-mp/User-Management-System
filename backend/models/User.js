

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
    ////isDeleted:{
        //type:Boolean,
       // default:false
    //},
    profilePicture: {
        type: String,
        default: 'https://res.cloudinary.com/dnk2llnda/image/upload/v1744026438/default-avatar-icon-of-social-media-user-vector_qre51i.jpg'
      }
},{
    timestamps:true
})

module.exports = mongoose.model('User',userSchema)