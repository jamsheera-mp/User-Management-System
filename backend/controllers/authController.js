

const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {



    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" })
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        
        console.log(`User Created ${newUser}`);
        
        // Save user to database
        await newUser.save();
          
        if(newUser){
              // Send response
        res.status(201).json({ message: 'User registered successfully', user: newUser });
        }else{
            res.status(400).json({message:"User data is not valid"})
        }
      



    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const loginUser = async (req, res) => {

    try {

    

        const { email, password } = req.body;
        if(!email|| !password){
            return res.status(400).json({message:"All fields are mandatory"})
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Generate JWT Token
        const token = jwt.sign(
            {user:
            {   id: user._id,
                name:user.name,
                email:user.email, 
                isAdmin: user.isAdmin },
            },
            process.env.JWT_SECRET ,
            { expiresIn: '7d' }
        );

        // Send response with token
         res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            },
            token
        });


    } catch (error) {
        console.error("Login errors:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
}
const getProfile = async (req,res)=>{
 try {

    const user = await User.findById(req.user.id).select("-password")
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    res.status(200).json({message:"Profile fetched successfully",user})
    
 } catch (error) {
    console.error("Profile fetch error",error);
    res.status(500).json({message:"Internal Server Error"})
    
 }
}






module.exports = {
    registerUser,
    loginUser,
    getProfile,
   
}