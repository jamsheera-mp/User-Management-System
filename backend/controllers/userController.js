const User = require("../models/User");

/*
const uploadProfilePicture = async (req, res) => {
  try {

    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const  {userId}  = req.body; 

    // Check if userId is an object with an id property
    const actualId = typeof userId === 'object' && userId.id ? userId.id : userId;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageUrl = req.file.path; // Cloudinary URL

    // 🔹 Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      actualId,
      { profilePicture: imageUrl },
      { new: true } // Return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl,
      user: updatedUser, // Send updated user data back
    });  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' ,error});
  }
};
*/

// controllers/userController.js


const uploadProfilePicture = async (req, res) => {
  try {
    console.log("Request received:", { body: req.body, file: req.file, userId: req.body.userId  });
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.file?.path) {
      return res.status(500).json({ message: "File upload failed to Cloudinary" });
    }
    
    const { userId } = req.body;
    console.log("Using userId:", userId);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update with Cloudinary URL
    user.profilePicture = req.file.path;
    await user.save();

    // Return success response with image URL and user data
    return res.status(200).json({
      success: true,
      imageUrl: req.file.path,
      user: {
        ...user.toObject(),
        password: undefined
      }
    });
    
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return res.status(500).json({ 
      message: 'Server error while uploading profile picture',
      error: error.message 
    });
  }
};

module.exports = {
  uploadProfilePicture
};

