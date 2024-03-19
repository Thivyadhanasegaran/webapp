// import winston from 'winston';
// import dotenv from "dotenv";
// dotenv.config();

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.simple()
//   ),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: process.env.LOGPATH??'./log/app.log'})

//   ]
// });


// logger.log('info', 'This is an informational message.');
// logger.log('error', 'This is an error message.');


// export default logger;


// import winston from 'winston';
// import dotenv from "dotenv";
// dotenv.config();

// // Define custom severity levels
// const customLevels = {
//   levels: {
//     error: 0,
//     warn: 1,
//     info: 2,
//     debug: 3
//   }
// };

// Register the custom severity levels with Winston
// winston.addColors(customLevels.levels);

// const logger = winston.createLogger({
//   level: 'info', // Default level set to 'info'
//   levels: customLevels.levels, // Custom severity levels
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json(),
//     winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
//   ),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: process.env.LOGPATH ?? './log/webapp/app.log'})
//   ]
// });

// logger.log('info', 'This is an informational message.');
// logger.log('error', 'This is an error message.');

// export default logger;


import winston from 'winston';
import dotenv from "dotenv";
dotenv.config();

// Define custom severity levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  }
};

// Register the custom severity levels with Winston
winston.addColors(customLevels.levels);

const logger = winston.createLogger({
  level: 'info', // Default level set to 'info'
  levels: customLevels.levels, // Custom severity levels
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Customizing timestamp format
    // winston.format.printf(info => JSON.stringify({ level: info.level, time: info.timestamp, message: info.message })) // Customizing log message format to JSON
    winston.format.printf(info => JSON.stringify({ message: info.message, time: info.timestamp })) // Customizing log message format to include only message and time

  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: process.env.LOGPATH ?? './log/webapp/app.log'})
  ]
});



export default logger;








