import dotenv from "dotenv";
dotenv.config();

export const config = {
  server: {
    HOST: process.env.SERVER_HOST || "localhost",
    PORT: parseInt(process.env.PORT || "5000", 10),
  },

  cookies: {
    REFRESH_COOKIE_MAXAGE: process.env.REFRESH_COOKIE_MAXAGE || 604800000,
    ACCESS_COOKIE_MAXAGE: process.env.ACCESS_COOKIE_MAXAGE || 300000,
  },

  cloudinary: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
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
    USER: process.env.REDIS_USER || "default",
    PASS: process.env.REDIS_PASS || "",
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
  },

  stripe: {
    currency: "inr",
    STRIPE_SERCRET: process.env.STRIPE_SECRET_KEY,
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    STRIPE_FRONTEND_URL: process.env.CORS_ALLOWED_ORIGIN,
  },

  ai: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },

  vectorDB: {
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    INDEX_NAME: process.env.PINECONE_INDEX_NAME,
  },
};
