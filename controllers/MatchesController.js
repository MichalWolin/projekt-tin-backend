const {
	getMatches,
	addMatch
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

module.exports = {
	getMatchesHandler,
  addMatchHandler
};