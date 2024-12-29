const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    dest: "../uploads"
})

const cloudinary = require('../configs/cloudinary')
router
    .route('/')
    .post(upload.single("img"),async(req,res)=>{
        const result = await cloudinary.uploader.upload(req.file.path)
        res.status(200).json({
            url: result.secure_url
        })
    })
module.exports = router