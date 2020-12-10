const express = require('express');
const mongoose = require ('mongoose');
const router = express.Router();
const uploader = require("./../config/cloudinary-setup");

const User = require('./../models/user.model');

router.post('/upload', uploader.single("image"), (req, res, next) => {
  console.log("file is: ", req.file);

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ secure_url: req.file.secure_url });
})


router.get('/:id', (req, res) => {
    const { id } = req.params;
    if ( !mongoose.Types.ObjectId.isValid(id)) {
      res
        .status(400)  
        .json({ message: 'Specified id is not valid'})
      return;
    }
    User
      .findById( id )
      .then( (foundUser) => {
        res.status(200).json(foundUser);  
      })
      .catch((err) => {
        res.status(500).json(err);		
      })
});

router.put('/:id', (req, res, next)=>{

    const { id } = req.params;
    const { username, image, dateOfBirth, phoneNumber, aboutBio } = req.body;
    console.log("PUT REQUEST WORKING")
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    User.findByIdAndUpdate(id, { username, image, dateOfBirth, phoneNumber, aboutBio })
      .then(() => {
        res.status(200).send();
      })
      .catch(err => {
        res.status(500).json(err);
      })
});

router.delete('/:id', (req, res)=>{
    const { id } = req.params;
    if ( !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    User.findByIdAndRemove(id)
      .then(() => {
        res
          .status(202)  
          .send(`Document ${id} was removed successfully.`);
      })
      .catch( err => {
        res.status(500).json(err);
      })
});


module.exports = router;