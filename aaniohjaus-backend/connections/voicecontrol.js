const mysql = require("mysql");
require("dotenv").config();

/**
 * Create database connection with .env-file
 */

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

module.exports = connection;
