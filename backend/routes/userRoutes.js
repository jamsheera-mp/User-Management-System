

const express = require('express')
const router = express.Router()
const {registerUser,loginUser,getProfile} = require('../controllers/authController')

const validateToken = require('../middleware/validateToken')
const { upload } = require('../config/cloudinary');

const {uploadProfilePicture} = require('../controllers/userController')

router.post('/upload-profile-picture',validateToken, upload.single('profilePicture'), uploadProfilePicture);

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/profile',validateToken,getProfile)
//router.post("/:id/upload", validateToken, upload.single("profilePicture"), uploadProfilePicture);





module.exports = router