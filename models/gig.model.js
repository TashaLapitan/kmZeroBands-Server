const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Band = require('./../models/band.model');
const User = require("../models/user.model");

const gigSchema = new Schema({
    
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {String},
    durationHours: Number,
    genres: [String],
    clientID: {type: Schema.Types.ObjectId, ref:"User"},
    bandID: {type: Schema.Types.ObjectId, ref:"Band"},
    pricePerHour: Number,
    isPending: {type: Boolean, default: true}

}, 
{
  timestamps: true
});

const Gig = mongoose.model('Gig', gigSchema);
module.exports = Gig;