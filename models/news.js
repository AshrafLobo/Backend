const mongoose = require('mongoose');

// News model
const News = mongoose.model('News', mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255,
  },
  article_src: {
    type: String
  },
  issuer: {
    type: new mongoose.Schema({
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
      src_small: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255
      }
    }),
    required: true
  },
  dateUpdated: {
    type: Date,
    default: Date.now
  }
}));

module.exports = News;