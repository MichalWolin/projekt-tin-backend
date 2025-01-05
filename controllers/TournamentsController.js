const {
  getTournaments,
  addTournament,
  removeTournament,
  getTournamentById,
  updateTournament,
  getTournamentManagerById
} = require('../models/TournamentsModel');

const getTournamentsHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await getTournaments(page);
    //TODO: dziwnie zwracam dane (to jest akurat ok)
    res.status(200).json( data );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addTournamentHandler = async (req, res) => {
  try {
    const data = req.body;
    await addTournament(data);
    res.status(201).json({ data });
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
    const data = await getTournamentById(id);
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

const updateTournamentHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await updateTournament(id, data);
    res.status(200).json({ id });
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