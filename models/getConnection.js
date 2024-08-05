const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Amrit@123',
  database: 'studenttracker'
};

async function getConnection() {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
}

module.exports = {
  getConnection
};
