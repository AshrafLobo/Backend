const mongoose = require('mongoose');

// Timeline model
const Timeline = mongoose.model('Timeline', mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 1024
  },
  timelineDate: {
    type: Date,
    required: true,
    max: Date.now
  },
  dateUpdated: {
    type: Date,
    default: Date.now
  }
}));

module.exports = Timeline;