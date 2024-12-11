import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Weather from "./components/Weather";
import Report from "./components/Report";
import "./tailwind.css";

const ProtectedRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [email, setEmail] = useState("");
  const [userId, setuserId] = useState("");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setuserId(decodedToken.id);
      setEmail(decodedToken.email);
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
  }, [token, userId, email]);

  const addSearchHistory = (city, temperature) => {
    const newSearchHistory = [...searchHistory, { city, temperature }];
    setSearchHistory(newSearchHistory);
    if (token) {
      axios
        .post(
          "http://localhost:5000/api/auth/search",
          { userId, city, temperature },
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
      <div className="min-h-screen flex flex-col">
        <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div className="text-xl font-semibold">
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </div>
          <div className="space-x-4">
            {!token && (
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            )}
            {token && (
              <>
                <Link to="/weather" className="hover:underline">
                  Weather
                </Link>
                <Link to="/report" className="hover:underline">
                  Report
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
        <div className="container mx-auto p-4 flex-grow">
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
                  <Report searchHistory={searchHistory} email={email} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <h1 className="text-3xl font-bold text-center">
                  Welcome to the Weather App
                </h1>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
