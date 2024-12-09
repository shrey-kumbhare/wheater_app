// server/routes/weather.js
const express = require("express");
const axios = require("axios");
const { weatherAPIKey } = require("../config");

const router = express.Router();

router.get("/:city", async (req, res) => {
  const { city } = req.params;
  try {
    const response = await axios.get(
      `http://api.weatherstack.com/current?access_key=${weatherAPIKey}&query=${city}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching weather data");
  }
});

module.exports = router;
