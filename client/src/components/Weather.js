// client/src/components/Weather.js
import React, { useState } from "react";
import axios from "axios";

const Weather = ({ token, addSearchHistory }) => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/weather/${city}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      setWeatherData(response.data);
      addSearchHistory(city, response.data.temperature);
    } catch (err) {
      setError("Error fetching weather data. Please try again.");
    }
  };

  return (
    <div>
      <h2>Check Weather</h2>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Check Weather</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
        <div>
          <h3>Weather Data for {weatherData.city}</h3>
          <p>City: {weatherData.city}</p>
          <p>Condition: {weatherData.condition}</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Temperature: {weatherData.temperature}°C</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
