const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Add search history
router.post("/search", async (req, res) => {
  const { userId, city } = req.body;
  try {
    const result = await User.addSearchHistory(userId, city);
    return res.status(201).json({ message: "Search history added", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get search history
router.get("/search/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const history = await User.getSearchHistory(userId);
    return res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
