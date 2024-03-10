import "dotenv/config";

export const appConfig = {
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  SECRET_KEY: process.env.SECRET_KEY,
  PORT: process.env.PORT || 5000,
};
