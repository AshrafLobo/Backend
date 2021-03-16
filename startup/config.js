const config = require('config');

module.exports = function () {
  /** Check if jwtPrivateKey is set */
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}