const winston = require('winston');

module.exports = function (err, req, res, next) {
  console.log("Your error is", err.message);
  // winston.error(err.message, { metadata: err });
  res.status(500).send('Something failed.');
};