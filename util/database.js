const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-app",
  password: "mrliem",
});

module.exports = pool.promise();
