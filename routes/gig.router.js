const express = require('express');
const mongoose = require ('mongoose');

const router = express.Router();
const Gig = require('./../models/gig.model');
const User = require('./../models/user.model');


router.post('/', (req, res, next) => {

    const clientID = req.session.currentUser ? req.session.currentUser._id : undefined;
    console.log(clientID)

    const { title, description, date, city, genre, durationHours, pricePerHour} = req.body;
    Gig.create ({ title, description, date, city, genre, durationHours, pricePerHour, clientID, isPending: true})
        .then((newGig) => {
            if (clientID) {
              User.findByIdAndUpdate(clientID, {$push: {gigHistory: newGig._id}})
              .then(() => {
                res
                .status(201)
                .json(newGig);
              })
            } else {
              res
                .status(201)
                .json(newGig);
            }
        })
        .catch((err) => {
            res
                .status(500) 
                .json(err)
        })
})

router.get('/search/:city', (req, res, next) => {
  const {city} = req.params;
  Gig.find({city})
    .populate('clientID')
    .then((foundGigs) => {
      res.status(200).json(foundGigs);
    })
    .catch(err => {
        res.status(500).json(err);
    })
})

router.get('/', (req, res, next) => {
    Gig
      .find()
      .then( (allGigs) => {
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
    const { title, description, city, date, genre, durationHours, pricePerHour } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    Gig.findByIdAndUpdate(id, {title, description, city, date, genre, durationHours, pricePerHour }, {new: true})
      .then((response) => {
        res.status(200).json(response);
      })
      .catch(err => {
        res.status(500).json(err);
      })
});

router.put(`/response/:id`, (req, res, next) => {
  const {id} = req.params;
  const {bandID, gigTitle, comment} = req.body;
  const responseObj = {bandID, comment, gigTitle, isRead: false}

  Gig.findByIdAndUpdate(id, {$push: {bandResponses: responseObj}}, {new: true})
    .then((response) => {
          res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

router.delete('/:id', (req, res)=>{
    const { id } = req.params;
    console.log('GIG id TO DELETE ', id)
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