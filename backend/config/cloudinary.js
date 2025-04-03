const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_pictures', // Cloudinary folder name
    allowedFormats: ['jpeg', 'png', 'jpg'], // Allowed formats
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
