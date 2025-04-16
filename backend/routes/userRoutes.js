

const express = require('express')
const router = express.Router()
const {registerUser,loginUser, refreshToken, getProfile, updateProfile} = require('../controllers/authController')
const validateToken = require('../middleware/validateToken')

const { upload } = require('../config/cloudinary');
const {uploadProfilePicture} = require('../controllers/userController')


router.post('/register',registerUser)
router.post('/login',loginUser)
router.post("/refresh-token", refreshToken);
router.get('/profile',validateToken,getProfile)
router.put('/profile',validateToken,updateProfile)
router.post('/upload-profile-picture',validateToken, upload.single('profilePicture'), uploadProfilePicture);




module.exports = router