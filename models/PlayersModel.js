const connection = require('../models/DatabaseConnection');

const getPlayerById = (id) => {
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

const getEligiblePlayers = (id) => {
  return new Promise((resolve, reject) => {
    const getEligiblePlayersQuery = `SELECT * FROM players WHERE gender = (SELECT gender FROM tournaments WHERE id = ?)`;
    connection.query(getEligiblePlayersQuery, [id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = {
  getPlayerById,
  getEligiblePlayers
};