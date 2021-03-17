const express = require('express');

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const winston = require('winston');

/** Declare app variable */
const app = express();

/** Load routes */
require('./startup/logging')(app);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);

/** Start server */
const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));