
const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up Multer to handle file uploads
const storage = multer.diskStorage({
    destination:async function  (req, file, cb) {
      await cb(null, './images');
    },
    filename: async function (req, file, cb) {
      await cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({ storage: storage });

router.post("/new", upload.single('image'),(req, res)=>{
    if(req.session.userId){
        if(req.file){

            const today = new Date();
            const currentTime = today.toISOString();
            const newPhoto = {
                user_id: req.session.userId,
                file_name: req.file.filename,
                date_time: currentTime,
                comments: []
            };
            Photo.insertMany([newPhoto]);
        }else{
            res.status(400).send("error");
        }
    }else{
        res.status(401).send("Invalid Credentials");
    }
})

module.exports = router;