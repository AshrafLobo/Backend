// Npm Imports
const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
  /** Connect to MongoDB */
  mongoose.connect(config.get('database'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
    .then(() => winston.info("Connected to MongoDB..."))
};