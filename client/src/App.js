// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios"; // Import axios for making API calls
import Login from "./components/Login";
import Signup from "./components/Signup";
import Weather from "./components/Weather";
import Report from "./components/Report";
import "./App.css";

const App = () => {
  const [token, setToken] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const addSearchHistory = (city, temperature) => {
    setSearchHistory([...searchHistory, { city, temperature }]);
  };

  const logout = async () => {
    if (token) {
      try {
        await axios.post(
          "http://localhost:5000/api/auth/search",
          { searchHistory },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Search history saved successfully.");
      } catch (error) {
        console.error("Error saving search history:", error);
      }
    }
    setToken(null);
    setSearchHistory([]);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-button">
            Home
          </Link>
          <Link to="/login" className="nav-button">
            Login
          </Link>
          <Link to="/signup" className="nav-button">
            Signup
          </Link>
          <Link to="/weather" className="nav-button">
            Weather
          </Link>
          <Link to="/report" className="nav-button">
            Report
          </Link>
          <button onClick={logout} className="nav-button">
            Logout
          </button>
        </nav>
        <Routes>
          <Route
            path="/login"
            element={
              <Login setToken={setToken} setSearchHistory={setSearchHistory} />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/weather"
            element={
              <Weather token={token} addSearchHistory={addSearchHistory} />
            }
          />
          <Route
            path="/report"
            element={<Report searchHistory={searchHistory} />}
          />
          <Route path="/" element={<h1>Welcome to the Weather App</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
