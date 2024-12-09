import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Weather from "./components/Weather";
import Report from "./components/Report";
import "./App.css";

const App = () => {
  const [token, setToken] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const addSearchHistory = async (city, temperature) => {
    if (!token) {
      console.error("No token available");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      await axios.post(
        "http://localhost:5000/api/search",
        { userId, city, temperature },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSearchHistory([...searchHistory, { city, temperature }]);
    } catch (error) {
      console.error("Error saving search history:", error);
    }
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
        </nav>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
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
