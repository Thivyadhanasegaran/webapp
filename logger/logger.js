import winston from 'winston';
import dotenv from "dotenv";
dotenv.config();

const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(), 
      winston.format.json() 
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: process.env.LOGPATH ?? './log/webapp/app.log'})
    ]
  });
  
  export default logger;






