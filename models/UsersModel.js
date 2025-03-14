const connection = require('../models/DatabaseConnection');

const registerNewUser = (login, password, email, role, name, surname, birthdate, gender) => {
  return new Promise((resolve, reject) => {
    const addUserQuery = 'INSERT INTO users (login, password, email, role) VALUES (?, ?, ?, ?)';
    connection.query(addUserQuery, [login, password, email, role], (error, result) => {
      if (error) {
        reject(error);
      }
      
      if (role === 'player') {
        const userId = result.insertId;
        const addPlayerQuery = 'INSERT INTO players (id, name, surname, birthdate, gender, points) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(addPlayerQuery, [userId, name, surname, birthdate, gender, 0], (error, result) => {
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

const updateUserData = (id, email, name, surname, birthdate) => {
  return new Promise((resolve, reject) => {
    const updateUserDataQuery = 'UPDATE users SET email = ? WHERE id = ?';
    connection.query(updateUserDataQuery, [email, id], (error, result) => {
      if (error) {
        reject(error);
      }
      
      const updatePlayerDataQuery = 'UPDATE players SET name = ?, surname = ?, birthdate = ? WHERE id = ?';
      connection.query(updatePlayerDataQuery, [name, surname, birthdate, id], (error, result) => {
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
  return new Promise((resolve, reject) => {
    const deletePlayersMatchesQuery = 'DELETE FROM matches WHERE player_1_id = ? OR player_2_id = ?';
    const deleteUsersTourneysQuery = 'DELETE FROM tournaments WHERE manager_id = ?';
    const deletePlayer = 'DELETE FROM players WHERE id = ?';
    const deleteUser = 'DELETE FROM users WHERE id = ?';

    connection.query(deletePlayersMatchesQuery, [id, id], (error, result) => {
      if (error) {
        reject(error);
      }

      connection.query(deleteUsersTourneysQuery, [id], (error, result) => {
        if (error) {
          reject(error);
        }

        connection.query(deletePlayer, [id], (error, result) => {
          if (error) {
            reject(error);
          }

          connection.query(deleteUser, [id], (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          });
        });
      });
    });
  });
};

const doesManagerExist = (id) => {
  const doesManagerExistQuery = 'SELECT * FROM users WHERE id = ? AND role = "manager"';
  return new Promise((resolve, reject) => {
    connection.query(doesManagerExistQuery, [id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result.length);
    });
  });
};

const doesLoginExist = (login) => {
  const doesLoginExistQuery = 'SELECT * FROM users WHERE login = ?';
  return new Promise((resolve, reject) => {
    connection.query(doesLoginExistQuery, [login], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result.length);
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
  deleteUser,
  doesManagerExist,
  doesLoginExist
};