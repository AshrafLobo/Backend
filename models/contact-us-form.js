const mongoose = require('mongoose');

// Contact us form model
const ContactUsForm = mongoose.model('ContactUsForm', mongoose.Schema({
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
    type: String
  },
  subject: {
    type: String,
    trim: true,
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1024
  }
}));

module.exports = ContactUsForm;