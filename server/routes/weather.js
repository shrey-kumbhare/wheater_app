const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const ACCESS_KEY = "672cb4090b44630164e815055032fa4e";

module.exports = (pool) => {
  router.get("/:city", async (req, res) => {
    const { city } = req.params;
    try {
      // Fetch weather data from Weatherstack API
      const response = await fetch(
        `http://api.weatherstack.com/current?access_key=${ACCESS_KEY}&query=${city}`
      );
      if (!response.ok) {
        return res
          .status(500)
          .json({ message: "Error fetching data from Weatherstack" });
      }

      const data = await response.json();
      if (data.current) {
        res.status(200).json({
          city: data.location.name,
          temperature: data.current.temperature,
          condition: data.current.weather_descriptions[0],
          humidity: data.current.humidity,
        });
      } else {
        res.status(404).json({ message: "City not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};
