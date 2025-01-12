const connection = require('../models/DatabaseConnection');
//TODO: Walidacja
const registerNewUser = (user) => {
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
    const getUserByIdQuery = 'SELECT * FROM users LEFT JOIN players ON users.id = players.id WHERE users.id = ?';
    connection.query(getUserByIdQuery, [id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const updateUserData = (id, data) => {
  return new Promise((resolve, reject) => {
    const updateUserDataQuery = 'UPDATE users SET email = ? WHERE id = ?';
    connection.query(updateUserDataQuery, [data.email, id], (error, result) => {
      if (error) {
        reject(error);
      }
      
      const updatePlayerDataQuery = 'UPDATE players SET name = ?, surname = ?, birthdate = ? WHERE id = ?';
      connection.query(updatePlayerDataQuery, [data.name, data.surname, data.birthdate, id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  });
};

const checkCredentialsById = (id, password) => {
  return new Promise((resolve, reject) => {
    const checkCredentialsByIdQuery = 'SELECT * FROM users WHERE id = ? AND password = ?';
    connection.query(checkCredentialsByIdQuery, [id, password], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const updatePassword = (id, password) => {
  return new Promise((resolve, reject) => {
    const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
    connection.query(updatePasswordQuery, [password, id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const deleteUser = (id) => {
  //TODO: Nalezy usuwac powiazane turnieje przed usunieciem uzytkownika
  return new Promise((resolve, reject) => {
    const deletePlayerQuery = 'DELETE FROM players WHERE id = ?';
    connection.query(deletePlayerQuery, [id], (error, result) => {
      if (error) {
        reject(error);
      }
      
      const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
      connection.query(deleteUserQuery, [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  });
};

module.exports = {
  registerNewUser,
  checkCredentials,
  getUserById,
  updateUserData,
  checkCredentialsById,
  updatePassword,
  deleteUser
};