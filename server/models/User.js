const mysql = require("mysql2/promise");
const { db } = require("../config");

const pool = mysql.createPool(db);

const User = {
  async create(name, email, phone, password) {
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, password]
    );
    return result;
  },
  async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },
  async checkCity(userId, city) {
    const [result] = await pool.execute(
      " SELECT * FROM search_history WHERE user_id  = ? and city=? ",
      [userId, city]
    );
    return result;
  },
  async addSearchHistory(userId, city, temperature) {
    const [result] = await pool.execute(
      "INSERT INTO search_history (user_id, city, temperature) VALUES (?, ?, ?)",
      [userId, city, temperature]
    );
    return result;
  },
  async updateSearchHistory(userId, city, temperature) {
    const [result] = await pool.execute(
      "UPDATE search_history SET temperature=?  WHERE user_id=? and city=?",
      [temperature, userId, city]
    );
    return result;
  },
  async getSearchHistory(userId) {
    const [rows] = await pool.execute(
      "SELECT city, temperature, searched_at FROM search_history WHERE user_id = ? ORDER BY searched_at DESC",
      [userId]
    );
    return rows;
  },
};

module.exports = User;
