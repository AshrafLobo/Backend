const winston = require('winston');
require('express-async-errors');

module.exports = function (app) {
  // winston Format
  const winstonFormat = {
    console: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    file: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
  }

  /** Handle Uncaught Promise and Synchronous Exceptions */
  winston.exceptions.handle(new winston.transports.File({
    filename: 'uncaughtExceptions.log'
  }));

  // Create winston transport
  winston.add(new winston.transports.File({
    level: 'info',
    filename: 'logfile.log',
    format: winstonFormat.file,
    handleExceptions: true,
    handleRejections: true
  }));

  // Add console logger only to development env
  if (app.get('env') === "development") {
    winston.add(new winston.transports.Console({
      level: 'info',
      format: winstonFormat.console,
      handleExceptions: true,
      handleRejections: true
    }));
  }
}