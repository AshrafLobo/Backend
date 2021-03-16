const mongoose = require('mongoose');

// Payroll download form model
const PayrollDownloadForm = mongoose.model('PayrollDownloadForm', mongoose.Schema({
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
    required: true,
  },
  phoneNumber: {
    type: String
  },
  company: {
    type: String,
    trim: true,
    required: true
  },
  numberOfEmployees: {
    type: Number,
    min: 0
  }
}));

module.exports = PayrollDownloadForm;