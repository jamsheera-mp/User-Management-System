//const isAdmin = require("../middleware/isAdmin");
const User = require("../models/User");
const mongoose = require("mongoose");
//const bcrypt = require('bcryptjs')

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error Fetching users", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getUSerDetail = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request params
    console.log("user id", userId);

    // Ensure that the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("-password");
    console.log("User details:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    // Save user to database
    const savedUser = await newUser.save();
    // Return the user without password
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      isAdmin: savedUser.isAdmin,
      profilePicture: savedUser.profilePicture,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}; */

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("Search query received in backend:", query);

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      isAdmin: false,
      $or: [
        { name: query ? { $regex: query, $options: "i" } : null },
        { email: query ? { $regex: query, $options: "i" } : null },
      ],
    }).select("-password");
    console.log("Search results:", users.length);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

const editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("User to be updated from frontend:",userId);
    
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId, isAdmin: false },
      { name, email },
      { new: true }
    ).select("-password");
  
    console.log("updated User:",updatedUser);
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findOneAndDelete({
      _id: userId,
      isAdmin: false,
    });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  searchUsers,
  editUser,
  deleteUser,
  getUSerDetail,
};
