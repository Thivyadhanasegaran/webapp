import winston from 'winston';
import dotenv from "dotenv";
dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: process.env.LOGPATH??'./log/app.log'})

  ]
});


logger.log('info', 'This is an informational message.');
logger.log('error', 'This is an error message.');


export default logger;






