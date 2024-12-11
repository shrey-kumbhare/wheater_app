const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const { jwtSecret } = require("../config");
const SECRET_KEY = jwtSecret;

module.exports = (pool) => {
  router.post("/register", async (req, res) => {
    const { username, password, email, phone } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username,email and password are required." });
    }

    try {
      const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Username already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        "INSERT INTO users (username, email, phone,password ) VALUES (?, ?,?, ? )",
        [username, email, phone, hashedPassword]
      );

      const token = jwt.sign({ id: result.insertId, username }, SECRET_KEY, {
        expiresIn: "1h",
      });

      return res.status(201).json({ token });
    } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).json({ error: "Database error during registration." });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "email and password are required." });
    }

    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
      });

      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Database error during login." });
    }
  });

  router.post("/search", async (req, res) => {
    const { userId, city, temperature } = req.body;

    if (!userId || !city) {
      return res
        .status(400)
        .json({ error: "User ID and city are required fields." });
    }

    try {
      const [result] = User.addSearchHistory(userId, city, temperature);

      return res.status(201).json({
        message: "Search history added successfully.",
        result,
      });
    } catch (error) {
      console.error("Error adding search history:", error);
      return res.status(500).json({ error: "Failed to add search history." });
    }
  });

  router.get("/search/:userId", async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      const [history] = await pool.query(
        "SELECT * FROM search_history WHERE user_id = ?",
        [userId]
      );

      if (history.length === 0) {
        return res
          .status(404)
          .json({ message: "No search history found for this user." });
      }

      return res.status(200).json(history);
    } catch (error) {
      console.error("Error fetching search history:", error);
      res.status(500).json({ error: "Database error while fetching history." });
    }
  });

  return router;
};
