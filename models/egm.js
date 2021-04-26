const mongoose = require('mongoose');

// EGM model
const Egm = mongoose.model('Egm', mongoose.Schema({
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issuer'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255
  },
  egmDate: {
    type: Date
  },
  venue: {
    type: String,
	default: 'TBD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  dateUpdated: {
    type: Date,
    default: Date.now
  }
}));

module.exports = Egm;