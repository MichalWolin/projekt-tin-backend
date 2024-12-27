const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qwerty@1234',
  database: 'tennis'
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Successfully connected to the database.");
});

module.exports = connection;