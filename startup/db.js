// Npm Imports
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
  /** Connect to MongoDB */
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
    .then(() => winston.info("Connected to MongoDB..."))
};