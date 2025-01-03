const connection = require('../models/DatabaseConnection');
//TODO: Walidacja
const registerNewUser = (user) => {
  //Pytania: Czy to powinno byc jako transakcja czy moge sobie darowac?
  return new Promise((resolve, reject) => {
    const addUserQuery = 'INSERT INTO users (login, password, email, role) VALUES (?, ?, ?, ?)';
    connection.query(addUserQuery, [user.login, user.password, user.email, user.role], (error, result) => {
      if (error) {
        reject(error);
      }
      
      if (user.role === 'player') {
        const userId = result.insertId;
        const addPlayerQuery = 'INSERT INTO players (id, name, surname, birthdate, gender, points) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(addPlayerQuery, [userId, user.name, user.surname, user.birthdate, user.gender, 0], (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        });
      } else {
        resolve(result);
      }
    });
  });
};

const checkCredentials = (credentials) => {
  return new Promise((resolve, reject) => {
    const checkCredentialsQuery = 'SELECT * FROM users WHERE login = ? AND password = ?';
    connection.query(checkCredentialsQuery, [credentials.login, credentials.password], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const getUserByIdQuery = 'SELECT * FROM users LEFT JOIN players ON users.id = players.id WHERE players.id = ?';
    connection.query(getUserByIdQuery, [id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = {
  registerNewUser,
  checkCredentials,
  getUserById
};