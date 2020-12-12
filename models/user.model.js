const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Band = require('./../models/band.model');

const userSchema = new Schema({
  
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: String,
    image: String,
    dateOfBirth: String,
    phoneNumber: String,
    isBandPOC: {type: Boolean, default: false},
    band: {type: Schema.Types.ObjectId, ref:"Band"},
    gigHistory: [{type: Schema.Types.ObjectId, ref:"Gig"}],
    aboutBio: String
}, 
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;