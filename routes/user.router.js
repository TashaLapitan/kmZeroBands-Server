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
      .then( (foundUser) => {
        res.status(200).json(foundUser);  
      })
      .catch((err) => {
        res.status(500).json(err);		
      })
});

router.put('/', (req, res, next)=>{

    const id = req.session.currentUser._id;
    const { username, image, dateOfBirth, phoneNumber, aboutBio, isBandPOC } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    User.findByIdAndUpdate(id, { username, image, dateOfBirth, phoneNumber, aboutBio, isBandPOC }, {new: true})
      .then(() => {
        // console.log('RESPONSE AFTER USER PUT REQUEST: ', )
        // req.session.currentUser = ;
        // console.log('REQ SESSION CURRENT USER AFTER USER PUT REQUEST ', req.session.currentUser)
        res.status(200).json();
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

// router.get('/update/:id', (req, res) => {
//   const {id} = req.params;
//   User.findById(id)
//     .then((user) => {
//       req.session.currentUser = user;
//       res.status(200).json(user);
//     })
// })


module.exports = router;