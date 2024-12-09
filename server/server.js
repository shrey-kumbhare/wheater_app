// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const weatherRoutes = require("./routes/weather");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
pool
  .getConnection()
  .then((connection) => {
    console.log("MySQL connected");
    connection.release();
  })
  .catch((err) => console.error("MySQL connection error:", err));

app.use("/api/auth", authRoutes(pool));
app.use("/api/weather", weatherRoutes(pool));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
