const {
  getPlayerById,
  getEligiblePlayers
} = require('../models/PlayersModel');

const getPlayerByIdHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getPlayerById(id);
    if (user.length === 0) {
      res.status(404).json({ message: 'Player not found.' });
    } else {
      res.status(200).json({ user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEligiblePlayersHandler = async (req, res) => {
  try {
    const tournamentId = req.params.id;

    if (isNaN(tournamentId) || tournamentId < 1) {
      res.status(400).json({ error: 'Invalid ID.' });
      return;
    }

    const players = await getEligiblePlayers(tournamentId);
    res.status(200).json({ players });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPlayerByIdHandler,
  getEligiblePlayersHandler
};