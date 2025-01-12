const {
	getMatches,
	addMatch,
  removeMatch,
  getMatchById,
  updateMatch
} = require('../models/MatchesModel');

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
    const match = req.body;
    const tournamentId = req.params.id;
    const data = await addMatch(match, tournamentId);
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