const mongoose = require('mongoose');
const User = require("../models/user.model");

const Schema   = mongoose.Schema;

const bandSchema = new Schema({

    title: {type: String, required: true},
    description: {type: String, required: true},
    image: String,
    genres: [String],
    phoneNumber: String,
    contactInfo: {type: String, required: true},
    instagramUrl: String,
    youtubeUrl: String,
    pocID: {type: Schema.Types.ObjectId, ref:'User'},
    // gigsHistory: [{type: Schema.Types.ObjectId, ref:"Gig", default: []}],
    pricePerHour: Number,
    canCustomizePlaylist: Boolean,
    minNoticePeriod: Number

}, 
{
  timestamps: true
});

const Band = mongoose.model('Band', bandSchema);
module.exports = Band;