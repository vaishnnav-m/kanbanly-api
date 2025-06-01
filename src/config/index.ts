import dotenv from "dotenv";
dotenv.config();

export const config = {
  server: {
    HOST: process.env.SERVER_HOST || "localhost",
    PORT: parseInt(process.env.PORT || "5000", 10),
  },

  database: {
    URI: process.env.DATABASE_URI || "mongodb://localhost:27017/kanbanly",
  },

  nodeMailer: {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  },

  cors: {
    ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN,
  },

  jwt: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "ACCESS_SECRET",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET",
  },
};
