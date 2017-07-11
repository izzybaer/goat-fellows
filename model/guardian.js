'use strict';

const mongoose = require('mongoose');

const guardianSchema = mongoose.Schema({
  firstName: {type: String, required: true, minlength: 1, maxlength: 256},
  lastName: {type: String, required: true, minlength: 1, maxlength: 256},
  email: {type: String, required: true, minlength: 1, maxlength: 256},
  city: {type: String, required: true, minlength: 1, maxlength: 50},
  state: {type: String, required: true, minlength: 2, maxlength: 2},
  service: {type: String, required: true},
  phoneNumber: {type: String, required: true},
  bio: {type: String, minlength: 0, maxlength: 500},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('guardian', guardianSchema);
