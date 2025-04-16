

const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

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

        if (newUser) {
            // Send response
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } else {
            res.status(400).json({ message: "User data is not valid" })
        }




    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const generateAccessToken = (user) => {
    return jwt.sign(
        { user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // Short-lived
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { user: { id: user._id } }, // Minimal data
        process.env.JWT_REFRESH_SECRET, // Separate secret
        { expiresIn: "7d" } // Long-lived
    );
};

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are mandatory" })
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }


        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

      
        // Send response with token
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                profilePicture:user.profilePicture||null,
            },
            accessToken,
            refreshToken
        });


    } catch (error) {
        console.error("Login errors:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
}


const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.user.id);
      if (!user) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
  
      const accessToken = generateAccessToken(user);
      res.status(200).json({ accessToken });
    } catch (error) {
      console.error("Refresh token error:", error.message);
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
  };


const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ message: "Profile fetched successfully", user })

    } catch (error) {
        console.error("Profile fetch error", error);
        res.status(500).json({ message: "Internal Server Error" })

    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if email is already taken by another user
        if (email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                name,
                email
            },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}





module.exports = {
    registerUser,
    loginUser,
    refreshToken,
    getProfile,
    updateProfile

}