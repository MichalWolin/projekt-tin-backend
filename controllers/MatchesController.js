const {
	getMatches,
	addMatch,
  removeMatch,
  getMatchById,
  updateMatch
} = require('../models/MatchesModel');

const {
  doesPlayerExist
} = require('../models/PlayersModel');

const {
  getTournamentById
} = require('../models/TournamentsModel');

const getMatchesHandler = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const tournamentId = req.params.id;
		const data = await getMatches(page, tournamentId);
		res.status(200).json( data );
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const addMatchHandler = async (req, res) => {
  try {
    const { player_1_id, player_2_id, date, manager_id } = req.body;
    const tournamentId = req.params.id;

    if (!player_1_id || !player_2_id || !date) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    if (player_1_id === player_2_id) {
      res.status(400).json({ error: 'Players must be different.' });
      return;
    }

    if (await doesPlayerExist(player_1_id) === 0) {
      res.status(400).json({ error: 'Player 1 does not exist.' });
      return;
    }

    if (await doesPlayerExist(player_2_id) === 0) {
      res.status(400).json({ error: 'Player 2 does not exist.' });
      return;
    }

    if (isNaN(tournamentId) || tournamentId < 1) {
      res.status(400).json({ error: 'Invalid ID.' });
      return;
    }

    const tournament = await getTournamentById(tournamentId);
    if (tournament.length === 0) {
      res.status(404).json({ error: 'Tournament not found.' });
      return;
    }

    if (new Date(date) < new Date(tournament[0].start_date) || new Date(date) > new Date(tournament[0].end_date)) {
      res.status(400).json({ error: 'Match date is not within tournament dates.' });
      return;
    }

    if (tournament[0].manager_id !== manager_id) {
      res.status(403).json({ error: 'You are not the manager of this tournament.' });
      return;
    }

    const data = await addMatch(player_1_id, player_2_id, tournamentId, date);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeMatchHandler = async (req, res) => {
  try {
    const matchId = req.params.id;
    const data = await removeMatch(matchId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMatchByIdHandler = async (req, res) => {
  try {
    const matchId = req.params.id;
    const data = await getMatchById(matchId);
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMatchHandler = async (req, res) => {
  try {
    const matchId = req.params.id;
    const data = req.body;
    await updateMatch(matchId, data);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
	getMatchesHandler,
  addMatchHandler,
  removeMatchHandler,
  getMatchByIdHandler,
  updateMatchHandler
};