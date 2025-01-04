const { getTournaments, addTournament } = require('../models/TournamentsModel');

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

module.exports = {
  getTournamentsHandler,
  addTournamentHandler
};