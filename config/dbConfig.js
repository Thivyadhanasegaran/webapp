import dotenv from "dotenv";
dotenv.config();

// export dbConfig;
export const dbConfig = {
  HOST: process.env.HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB,
  dialect: process.env.DIALECT,
  NODE_ENV: process.env.NODE_ENV,
  TOPIC_NAME: process.env.TOPIC_NAME,
};
