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
      setWeatherData(response.data);
      addSearchHistory(city, response.data.temperature);
    } catch (err) {
      setError("Error fetching weather data. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Check Weather
        </h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6 text-center">
          <button
            onClick={handleSearch}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Check Weather
          </button>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {weatherData && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-center text-blue-600 mb-4">
              Weather Data for {weatherData.city}
            </h3>
            <p className="text-center text-lg">
              <span className="font-bold">Condition:</span>{" "}
              {weatherData.condition}
            </p>
            <p className="text-center text-lg">
              <span className="font-bold">Humidity:</span>{" "}
              {weatherData.humidity}%
            </p>
            <p className="text-center text-lg">
              <span className="font-bold">Temperature:</span>{" "}
              {weatherData.temperature}°C
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
