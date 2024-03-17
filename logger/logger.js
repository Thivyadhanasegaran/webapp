import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});


logger.log('info', 'This is an informational message.');
logger.log('error', 'This is an error message.');


export default logger;




// import { Logger } from 'node-json-logger';

// // Create a new instance of the Logger class 
// const logger = new Logger({
//   timestampFormat: 'YYYY-MM-DDTHH:mm:ss.SSSZ', 
//   logLevel: 'info', 
//   logFilePath: '/var/log/myapp.log', 
//   includeErrorStackTrace: true, 
//   appName: 'MyWebApp'
// });

// // Log messages
// logger.info('This is an informational message.');
// logger.warn('This is a warning message.');
// logger.error('This is an error message.');

// export default logger;

