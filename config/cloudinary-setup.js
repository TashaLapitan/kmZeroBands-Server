const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage =  cloudinaryStorage({
  cloudinary,
  folder: "km-zero-bands-storage", 
  allowedFormats: ['jpg', 'png', 'jpeg', 'gif'],
  // transformation: [{ width: 120, height: 90, crop: 'fill' }],
  filename: function (req, res, cb) {
    let fileName = res.originalname.split(".");
    cb(null, fileName[0]); 
  },
});

const uploader = multer({ storage });
module.exports = uploader;