const mongoose = require('mongoose');

// Dividend model
const Dividend = mongoose.model('Dividend', mongoose.Schema({
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issuer'
  },
  bookClosureDate: {
    type: Date
  },
  disbursmentDate: {
    type: Date
  },
  dividendType: {
    type: String,
    minLength: 2,
    maxLength: 50,
    required: true,
    default: 'TBD'
  },
  dividendRate: {
    type: Boolean,
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

module.exports = Dividend;