const {
  getTournaments,
  addTournament,
  removeTournament,
  getTournamentById,
  updateTournament,
  getTournamentManagerById
} = require('../models/TournamentsModel');

const {
  doesManagerExist
} = require('../models/UsersModel');

const getTournamentsHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await getTournaments(page);
    res.status(200).json( data );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addTournamentHandler = async (req, res) => {
  try {
    const { tournament_name, start_date, end_date, manager_id, gender } = req.body;
    if (!tournament_name || !start_date || !end_date || !manager_id || !gender) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    if (tournament_name.length < 3 || tournament_name.length > 255) {
      res.status(400).json({ error: 'Name must be between 3 and 255 characters.' });
      return;
    }

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    if (startDateObj < new Date()) {
      res.status(400).json({ error: 'Start date must be in the future.' });
      return;
    }

    if (startDateObj > endDateObj) {
      res.status(400).json({ error: 'End date must be after start date.' });
      return;
    }

    if (endDateObj - startDateObj < 24 * 60 * 60 * 1000) {
      res.status(400).json({ error: 'Tournament must last at least 1 day.' });
      return;
    }

    if (endDateObj - startDateObj > 24 * 60 * 60 * 1000 * 14) {
      res.status(400).json({ error: 'Tournament must last at most 14 days.' });
      return;
    }

    if (gender !== "male" && gender !== "female") {
      res.status(400).json({ error: 'Gender must be either male or female.' });
    }

    if (isNaN(manager_id) || manager_id < 1) {
      res.status(400).json({ error: 'Invalid manager ID.' });
      return;
    }

    const manager = await doesManagerExist(manager_id);
    if (manager.length === 0) {
      res.status(400).json({ error: 'Manager does not exist.' });
      return;
    }

    const data = await addTournament(tournament_name, start_date, end_date, manager_id, gender);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeTournamentHandler = async (req, res) => {
  try {
    const id = req.params.id;
    await removeTournament(id);
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTournamentByIdHandler = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id) || id < 1) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const data = await getTournamentById(id);
    if (data.length === 0) {
      res.status(404).json({ error: 'Tournament not found.' });
      return;
    }

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTournamentHandler = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const { tournament_name, start_date, end_date, manager_id } = req.body;

    if (!tournament_name || !start_date || !end_date || !manager_id) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    const tournament = await getTournamentById(tournamentId);
    if (tournament.length === 0) {
      res.status(404).json({ error: 'Tournament not found.' });
      return;
    }

    if (isNaN(manager_id) || manager_id < 1) {
      res.status(400).json({ error: 'Invalid manager ID.' });
      return;
    }

    const manager = await doesManagerExist(manager_id);
    if (manager.length === 0) {
      res.status(400).json({ error: 'Manager does not exist.' });
      return;
    }

    if (tournament[0].manager_id != manager_id) {
      res.status(403).json({ error: 'You are not the manager of this tournament.' });
      return;
    }

    if (tournament_name.length < 3 || tournament_name.length > 255) {
      res.status(400).json({ error: 'Name must be between 3 and 255 characters.' });
      return;
    }

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    if (startDateObj < new Date()) {
      res.status(400).json({ error: 'Start date must be in the future.' });
      return;
    }

    if (startDateObj > endDateObj) {
      res.status(400).json({ error: 'End date must be after start date.' });
      return;
    }

    if (endDateObj - startDateObj < 24 * 60 * 60 * 1000) {
      res.status(400).json({ error: 'Tournament must last at least 1 day.' });
      return;
    }

    if (endDateObj - startDateObj > 24 * 60 * 60 * 1000 * 14) {
      res.status(400).json({ error: 'Tournament must last at most 14 days.' });
      return;
    }

    await updateTournament(tournamentId, tournament_name, start_date, end_date, manager_id);
    res.status(200).json({ message: 'Tournament updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTournamentManagerByIdHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getTournamentManagerById(id);
    if (data.length === 0) {
      res.status(404).json({ error: 'Tournament not found.' });
      return;
    } else {
      res.status(200).json(data[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTournamentsHandler,
  addTournamentHandler,
  removeTournamentHandler,
  getTournamentByIdHandler,
  updateTournamentHandler,
  getTournamentManagerByIdHandler
};