const connection = require('../models/DatabaseConnection');

const getMatches = (page, tournamentId) => {
  return new Promise((resolve, reject) => {
    limit = 3;
    const getMatchesQuery = 'SELECT * FROM matches WHERE tournament_id = ? ORDER BY date ASC LIMIT ? OFFSET ? ';
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

module.exports = {
  getMatches
};