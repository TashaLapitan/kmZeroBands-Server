const express = require('express');
const mongoose = require ('mongoose');
const router = express.Router();
const Band = require('./../models/band.model');
const User = require("../models/user.model");

router.post('/', (req, res, next) => {
    const pocID = req.session.currentUser._id 
    const { title, description, imageUrl, genres, phoneNumber, contactInfo, instagramUrl, youtubeUrl, pricePerHour, canCustomizePlaylist, minNoticePeriod } = req.body;

    Band.create ({ title, description, imageUrl, genres, phoneNumber, contactInfo, instagramUrl, youtubeUrl, pricePerHour, canCustomizePlaylist, minNoticePeriod, pocID})
        .then((createdBand) => {
            res
                .status(201)
                .json(createdBand);
        })
        .catch((err) => {
            res
                .status(500) 
                .json(err)
        })
})

router.get('/', (req, res, next) => {
    Band
      .find()
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
    const { title, description, imageUrl, genres, phoneNumber, contactInfo, instagramUrl, youtubeUrl, pricePerHour, canCustomizePlaylist, minNoticePeriod } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    Band.findByIdAndUpdate(id, { title, description, imageUrl, genres, phoneNumber, contactInfo, instagramUrl, youtubeUrl, pricePerHour, canCustomizePlaylist, minNoticePeriod })
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
    Band.findByIdAndRemove(id)
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
