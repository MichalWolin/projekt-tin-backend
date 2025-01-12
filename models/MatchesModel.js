const connection = require('../models/DatabaseConnection');

const getMatches = (page, tournamentId) => {
  return new Promise((resolve, reject) => {
    limit = 2;
    const getMatchesQuery = 
    `SELECT matches.*, p1.name AS player_1_name, p1.surname AS player_1_surname, p2.name AS player_2_name, p2.surname AS player_2_surname
    FROM matches
    INNER JOIN players p1 ON matches.player_1_id = p1.id
    INNER JOIN players p2 ON matches.player_2_id = p2.id
    WHERE matches.tournament_id = ?
    ORDER BY matches.date ASC
    LIMIT ? OFFSET ?`;

    connection.query(getMatchesQuery, [tournamentId, limit, (page - 1) * limit], (error, result) => {
      if (error) {
        reject(error);
      }

      const countMatchesQuery = 'SELECT COUNT(*) AS count FROM matches WHERE tournament_id = ?';
      connection.query(countMatchesQuery, [tournamentId], (error, countResult) => {
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

const addMatch = (match, tournamentId) => {
  return new Promise((resolve, reject) => {
    const addMatchQuery = `INSERT INTO matches (player_1_id, player_2_id, tournament_id, date) VALUES (?, ?, ?, ?)`;
    connection.query(addMatchQuery, [match.player_1_id, match.player_2_id, tournamentId, match.date], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const removeMatch = (matchId) => {
  return new Promise((resolve, reject) => {
    const removeMatchQuery = `DELETE FROM matches WHERE id = ?`;
    connection.query(removeMatchQuery, [matchId], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const getMatchById = (matchId) => {
  return new Promise((resolve, reject) => {
    const getMatchByIdQuery =
    `SELECT m.*, t.manager_id AS tournament_manager_id
    FROM matches m
    INNER JOIN tournaments t ON m.tournament_id = t.id
    WHERE m.id = ?`;

    connection.query(getMatchByIdQuery, [matchId], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const updateMatch = (matchId, data) => {
  return new Promise((resolve, reject) => {
    const updateMatchQuery = `UPDATE matches SET player_1_id = ?, player_2_id = ?, date = ?, set1 = ?, set2 = ?, set3 = ? WHERE id = ?`;
    connection.query(updateMatchQuery, [data.player_1_id, data.player_2_id, data.date, data.set1, data.set2, data.set3, matchId], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = {
  getMatches,
  addMatch,
  removeMatch,
  getMatchById,
  updateMatch
};