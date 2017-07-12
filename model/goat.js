'use strict';

const mongoose = require('mongoose');

const goatSchema = mongoose.Schema({
  address: {type: String, required: true, minlength: 1, maxlength: 256},
  address2: {type: String, minlength: 1, maxlength: 256},
  city: {type: String, required: true, minlength: 1, maxlength: 50},
  state: {type: String, required: true, minlength: 2, maxlength: 2},
  zipCode: {type: Number, minlength: 5, maxlength: 5},
  photoURI: {type: String, required: true},
  story: {type: String, required: true, minlength: 10, maxlength: 500},
  name: {type: String, minlength: 1, maxlength: 256},
  gender: {type: Boolean},
  breed: {type: String, minlength: 1, maxlength: 256},
  weight: {type: Number, minlength: 1, maxlength: 256},
  age: {type: Number, minlength: 1, maxlength: 256},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  guardianID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'guardian'},
});

module.exports = mongoose.model('goat', goatSchema);
