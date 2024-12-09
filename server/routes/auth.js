// server/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (pool) => {
  router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
      const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        "INSERT INTO users (username, password, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())",
        [username, hashedPassword]
      );
      const token = jwt.sign({ id: result.insertId, username }, SECRET_KEY, {
        expiresIn: "1h",
      });
      return res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Database error" });
    }
  });
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      if (rows.length > 0) {
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: "1h" }
          );
          return res.status(200).json({ token });
        }
      }
      return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Database error" });
    }
  });

  return router;
};
