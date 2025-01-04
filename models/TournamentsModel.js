const connection = require('../models/DatabaseConnection');

const getTournaments = (page) => {
  return new Promise((resolve, reject) => {
    limit = 3;
    const getTournamentsQuery = 'SELECT * FROM tournaments ORDER BY start_date ASC LIMIT ? OFFSET ? ';
    connection.query(getTournamentsQuery, [limit, (page - 1) * limit], (error, result) => {
      if (error) {
        reject(error);
      }

      const countTournamentsQuery = 'SELECT COUNT(*) AS count FROM tournaments';
      connection.query(countTournamentsQuery, (error, countResult) => {
        if (error) {
          reject(error);
        }

        let hasNextPage = true;
        const totalPages = Math.ceil(countResult[0].count / limit);
        if (page >= totalPages) {
          hasNextPage = false;
        }

        resolve({ tournaments: result, hasNextPage });
      });
    });
  });
};

const addTournament = (data) => {
  //TODO: trzeba sprawdzic czy manager istnieje
  return new Promise((resolve, reject) => {
    const addTournamentQuery = 'INSERT INTO tournaments (name, start_date, end_date, manager_id, gender) VALUES (?, ?, ?, ?, ?)';
    connection.query(addTournamentQuery, [data.name, data.start_date, data.end_date, data.manager_id, data.gender], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = {
  getTournaments,
  addTournament
};