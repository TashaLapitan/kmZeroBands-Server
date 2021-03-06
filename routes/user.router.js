const express = require('express');
const mongoose = require ('mongoose');
const router = express.Router();
const uploader = require("./../config/cloudinary-setup");

const User = require('./../models/user.model');

router.post('/upload', uploader.single("image"), (req, res, next) => {

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
      .populate('band')
      .populate('gigHistory')
      .then( (foundUser) => {
        res.status(200).json(foundUser);  
      })
      .catch((err) => {
        res.status(500).json(err);		
      })
});

router.put('/', (req, res, next)=>{

    const id = req.session.currentUser._id;
    const { username, image, phoneNumber, aboutBio } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    User.findByIdAndUpdate(id, { username, image, phoneNumber, aboutBio }, {new: true})
      .then((updatedUser) => {
        req.session.currentUser = updatedUser;
        res.status(200).json(updatedUser);
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