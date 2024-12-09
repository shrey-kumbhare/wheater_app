// server/models/User.js
const mysql = require("mysql2/promise");
const { db } = require("../config");

const pool = mysql.createPool(db);

const User = {
  async create(username, password) {
    const [result] = await pool.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );
    return result;
  },

  async findByUsername(username) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows[0];
  },

  async addSearchHistory(userId, city) {
    const [result] = await pool.execute(
      "INSERT INTO search_history (user_id, city) VALUES (?, ?)",
      [userId, city]
    );
    return result;
  },

  async getSearchHistory(userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM search_history WHERE user_id = ? ORDER BY searched_at DESC",
      [userId]
    );
    return rows;
  },
};

module.exports = User;
