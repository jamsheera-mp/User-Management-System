const User = require("../models/User");


const uploadProfilePicture = async (req, res) => {
  try {

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

module.exports = { uploadProfilePicture };
