const mongoose = require('mongoose');

// Share registration form model
const ShareRegistrationForm = mongoose.model('ShareRegistrationForm', mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String
  },
  idNumber: {
    type: String,
    required: true,
    minlength: 5
  },
  cdscNumber: {
    type: String,
    minlength: 5
  },
  company: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1024
  }
}));

module.exports = ShareRegistrationForm;