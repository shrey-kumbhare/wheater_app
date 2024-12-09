// server/config.js
require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  weatherAPIKey: process.env.WEATHER_API_KEY,
};
