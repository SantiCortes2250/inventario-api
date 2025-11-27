const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Formato personalizado
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Configuración del logger
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), myFormat)
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
