const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const responseSubschema = new Schema({
    bandID: {type: Schema.Types.ObjectId, ref:"Band"},
    gigTitle: "",
    isRead: {type: Boolean, default: false},
    comment: String
}, 
{
  timestamps: true
});

module.exports = responseSubschema;