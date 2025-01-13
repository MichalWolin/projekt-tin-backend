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

const addTournament = (tournament_name, start_date, end_date, manager_id, gender) => {
  return new Promise((resolve, reject) => {
    const addTournamentQuery = 'INSERT INTO tournaments (name, start_date, end_date, manager_id, gender) VALUES (?, ?, ?, ?, ?)';
    connection.query(addTournamentQuery, [tournament_name, start_date, end_date, manager_id, gender], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const removeTournament = (id) => {
  return new Promise((resolve, reject) => {
    //Pytania: Czy powinienem sprawdzać czy turniej istnieje?
    const removeTournamentsMatchesQuery = 'DELETE FROM matches WHERE tournament_id = ?';
    connection.query(removeTournamentsMatchesQuery, [id], (error, result) => {
      if (error) {
        reject(error);
      }

      const removeTournamentQuery = 'DELETE FROM tournaments WHERE id = ?';
      connection.query(removeTournamentQuery, [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  });
};

const getTournamentById = (id) => {
  const getTournamentByIdQuery = 'SELECT * FROM tournaments WHERE id = ?';
  return new Promise((resolve, reject) => {
    connection.query(getTournamentByIdQuery, [id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const updateTournament = (id, name, start_date, end_date) => {
  return new Promise((resolve, reject) => {
    const updateTournamentQuery = 'UPDATE tournaments SET name = ?, start_date = ?, end_date = ? WHERE id = ?';
    connection.query(updateTournamentQuery, [name, start_date, end_date, id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const getTournamentManagerById = (id) => {
  const getTournamentManagerByIdQuery = 'SELECT manager_id FROM tournaments WHERE id = ?';
  return new Promise((resolve, reject) => {
    connection.query(getTournamentManagerByIdQuery, [id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = {
  getTournaments,
  addTournament,
  removeTournament,
  getTournamentById,
  updateTournament,
  getTournamentManagerById
};