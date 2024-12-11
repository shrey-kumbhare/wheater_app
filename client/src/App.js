import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Weather from "./components/Weather";
import Report from "./components/Report";
import "./App.css";

const ProtectedRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    if (token) {
      const userId = 1;
      axios
        .get(`http://localhost:5000/api/auth/search/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setSearchHistory(response.data);
        })
        .catch((error) => {
          console.error("Error fetching search history:", error);
        });
    }
  }, [token]);

  const addSearchHistory = (city, temperature) => {
    const newSearchHistory = [...searchHistory, { city, temperature }];
    setSearchHistory(newSearchHistory);
    if (token) {
      axios
        .post(
          "http://localhost:5000/api/auth/search",
          { userId: 1, city, temperature },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          console.log("Search history saved successfully.");
        })
        .catch((error) => {
          console.error("Error saving search history:", error);
        });
    }
  };
  const logout = () => {
    setToken(null);
    setSearchHistory([]);
    localStorage.removeItem("token");
    console.log("Logged out successfully.");
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-button">
            Home
          </Link>
          {!token && (
            <Link to="/login" className="nav-button">
              Login
            </Link>
          )}

          {token && (
            <Link to="/weather" className="nav-button">
              Weather
            </Link>
          )}
          {token && (
            <Link to="/report" className="nav-button">
              Report
            </Link>
          )}
          {token && (
            <button onClick={logout} className="nav-button">
              Logout
            </button>
          )}
        </nav>
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                setToken={setToken}
                token={token}
                setSearchHistory={setSearchHistory}
              />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/weather"
            element={
              <ProtectedRoute token={token}>
                <Weather token={token} addSearchHistory={addSearchHistory} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute token={token}>
                <Report searchHistory={searchHistory} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<h1>Welcome to the Weather App</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
