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
    ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000",
  },

  jwt: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "ACCESS_SECRET",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET",
    VERIFICATION_TOKEN_SECRET:
      process.env.VERIFICATION_TOKEN_SECRET || "VERIFICATION_TOKEN_SECRET",
  },

  googleAuth: {
    CLIENT_ID: process.env.OAUTH_CLIENT_ID,
    CLIENT_SECRET: process.env.OAUTH_SECRET,
    CLIENT_REDIRECT_URI: process.env.REDIRECT_URI,
    USERINFO_ENDPOINT: process.env.GOOGLE_USERINFO_ENDPOINT || "",
  },

  redis: {
    USER: process.env.REDIS_USER || 'default',
    PASS: process.env.REDIS_PASS || '',
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
  },
};
