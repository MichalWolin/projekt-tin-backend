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

const doesPlayerExist = (id) => {
  return new Promise((resolve, reject) => {
    const doesPlayerExistQuery = 'SELECT * FROM players WHERE id = ?';
    connection.query(doesPlayerExistQuery, [id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const getRanking = (page) => {
  return new Promise((resolve, reject) => {
    limit = 8;
    const getRankingQuery = 'SELECT * FROM players ORDER BY points DESC LIMIT ? OFFSET ? ';
    connection.query(getRankingQuery, [limit, (page - 1) * limit], (error, result) => {
      if (error) {
        reject(error);
      }

      const countPlayersQuery = 'SELECT COUNT(*) AS count FROM players';
      connection.query(countPlayersQuery, (error, countResult) => {
        if (error) {
          reject(error);
        }

        let hasNextPage = true;
        const totalPages = Math.ceil(countResult[0].count / limit);
        if (page >= totalPages) {
          hasNextPage = false;
        }

        resolve({ players: result, hasNextPage });
      });
    });
  });
};

const getPlayersMatches = (id, page) => {
  return new Promise((resolve, reject) => {
    limit = 3;
    const getPlayersMatchesQuery =
    `SELECT matches.*, p1.name AS player_1_name, p1.surname AS player_1_surname, p2.name AS player_2_name, p2.surname AS player_2_surname
    FROM matches
    INNER JOIN players p1 ON matches.player_1_id = p1.id
    INNER JOIN players p2 ON matches.player_2_id = p2.id
    WHERE player_1_id = ? OR player_2_id = ?
    ORDER BY matches.date ASC
    LIMIT ? OFFSET ?`;

    connection.query(getPlayersMatchesQuery, [id, id, limit, (page - 1) * limit], (error, result) => {
      if (error) {
        reject(error);
      }

      const countPlayersMatchesQuery = 'SELECT COUNT(*) AS count FROM matches WHERE player_1_id = ? OR player_2_id = ?';
      connection.query(countPlayersMatchesQuery, [id, id], (error, countResult) => {
        if (error) {
          reject(error);
        }

        let hasNextPage = true;
        const totalPages = Math.ceil(countResult[0].count / limit);
        if (page >= totalPages) {
          hasNextPage = false;
        }

        resolve({ matches: result, hasNextPage });
      });
    });
  });
};

module.exports = {
  getPlayerById,
  getEligiblePlayers,
  doesPlayerExist,
  getRanking,
  getPlayersMatches
};