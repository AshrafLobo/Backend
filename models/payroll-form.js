const mongoose = require('mongoose');

// Payroll form model
const PayrollForm = mongoose.model('PayrollForm', mongoose.Schema({
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
  company: {
    type: String,
    trim: true,
    required: true
  },
  jobTitle: {
    type: String,
    trim: true
  },
  numberOfEmployees: {
    type: Number,
    min: 0
  },
  enquireAbout: {
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

module.exports = PayrollForm;