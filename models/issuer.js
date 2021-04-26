const mongoose = require('mongoose');

// Issuer model
const Issuer = mongoose.model('Issuer', mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255
  },
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255
  },
  description: {
    type: String,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  src_small: {
    type: String,
    required: true,
  },
  url_link: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
}));

module.exports = Issuer;