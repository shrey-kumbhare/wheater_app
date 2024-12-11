const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const weatherRoutes = require("./routes/weather");
const mysql = require("mysql2/promise");
const con = require("./config");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const pool = mysql.createPool({
  host: con.db.host,
  user: con.db.user,
  password: con.db.password,
  database: con.db.database,
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

const PORT = con.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
