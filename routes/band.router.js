const express = require('express');
const mongoose = require ('mongoose');
const router = express.Router();
const uploader = require("./../config/cloudinary-setup");

const Band = require('./../models/band.model');
const User = require('./../models/user.model');

router.post('/', (req, res, next) => {
    const pocID = req.session.currentUser._id;
    
    const { title, description, image, city, genres, phoneNumber, contactInfo, instagramUrl, youtubeUrl, pricePerHour, canCustomizePlaylist, minNoticePeriod } = req.body;
    const endpoint = title.toLowerCase().split(" ").join("-");

    Band.create ({ title, endpoint, description, image, city, genres, phoneNumber, contactInfo, instagramUrl, youtubeUrl, pricePerHour, canCustomizePlaylist, minNoticePeriod, pocID})
        .then((createdBand) => {
            const bandID = createdBand._id;
            return bandID;
        })
        .then((bandID) => {
          const pr = User.findByIdAndUpdate(pocID, {isBandPOC: true, band: bandID}, {new: true}) 
          return pr
        })
        .then(updatedUser => {
          req.session.currentUser = updatedUser;
          return updatedUser.band;
        })
        .then((newBandID) => {   
          const pr = Band.findById(newBandID)
          return pr 
        })
        .then(newBand => {
          res 
            .status(201)
            .json(newBand);
        })
        .catch((err) => {
            res
                .status(500) 
                .json(err)
        })
});

router.get('/', (req, res, next) => {
    Band
      .find()
      .populate('pocID')
      .then( (allBands) => {
        res.status(200).json(allBands);
      })
      .catch(err => {
        res.status(500).json(err);
      })
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    if ( !mongoose.Types.ObjectId.isValid(id)) {
      res
        .status(400)  
        .json({ message: 'Specified id is not valid'})
      return;
    }
    Band
      .findById( id )
      .then( (oneBand) => {
        res.status(200).json(oneBand);  
      })
      .catch((err) => {
        res.status(500).json(err);		
      })
});

router.put('/:id', (req, res, next)=>{
    const { id } = req.params;
    const { title, description, city, image, genres, phoneNumber, contactInfo, instagramUrl, youtubeUrl, pricePerHour, canCustomizePlaylist, minNoticePeriod } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    Band.findByIdAndUpdate(id, { title, description, city, image, genres, phoneNumber, contactInfo, instagramUrl, youtubeUrl, pricePerHour, canCustomizePlaylist, minNoticePeriod })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch(err => {
        res.status(500).json(err);
      })
});

router.delete('/:id', (req, res)=>{
    const { id } = req.params;
    const userID = req.session.currentUser._id;
    if ( !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    Band.findByIdAndRemove(id)
      .then(() => {
        res
          .status(202)  
          .send(`Document ${id} was removed successfully.`);
      })
      .then(() => {
        const pr = User.findByIdAndUpdate(userID, {isBandPOC: false, band: undefined}, {new: true})
        return pr;
      })
      .then((updatedUser) => {
        req.session.currentUser = updatedUser;
      })
      .catch( err => {
        res.status(500).json(err);
      })
});

router.post('/upload', uploader.single("image"), (req, res, next) => {

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ secure_url: req.file.secure_url });
})

module.exports = router;
