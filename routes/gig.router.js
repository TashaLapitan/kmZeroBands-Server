const express = require('express');
const mongoose = require ('mongoose');
const router = express.Router();
const Gig = require('./../models/gig.model');
const User = require('./../models/user.model');


router.post('/', (req, res, next) => {
    const clientID = req.session.currentUser._id; 
    const { title, description, date, city, genre, durationHours, pricePerHour} = req.body;
    Gig.create ({ title, description, date, city, genre, durationHours, pricePerHour, clientID, isPending: true})
        .then((newGig) => {
            User.findByIdAndUpdate(clientID, {$push: {gigHistory: newGig._id}})
              .then(() => {
                res
                .status(201)
                .json(newGig);
              })
        })
        .catch((err) => {
            res
                .status(500) 
                .json(err)
        })
})

router.get('/', (req, res, next) => {
    Gig
      .find()
      .populate('clientID')
      .then( (allGigs) => {
        console.log('allGigs', allGigs)
        res.status(200).json(allGigs);
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
    Gig
      .findById( id )
      .then( (oneGig) => {
        res.status(200).json(oneGig);  
      })
      .catch((err) => {
        res.status(500).json(err);		
      })
});

router.put('/:id', (req, res, next)=>{
    const { id } = req.params;
    const { title, description, durationHours, date, genres, pricePerHour, isPending } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    Gig.findByIdAndUpdate(id, { title, description, durationHours, date, genres, pricePerHour, isPending })
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
    Gig.findByIdAndRemove(id)
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