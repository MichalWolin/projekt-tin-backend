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

    if (isNaN(tournamentId) || tournamentId < 1) {
      res.status(400).json({ error: 'Invalid ID.' });
      return;
    }

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

const validateSetScore = (set) => {
  if (!/^[0-7]:[0-7]$/.test(set)) {
    return false;
  }

  const [score1, score2] = set.split(":");
  if ((score1 == 6 && score2 <= 4 && score2 >= 0) || 
  (score1 <= 4 && score1 >= 0 && score2 == 6) || 
  (score1 == 7 && score2 == 5) || 
  (score1 == 5 && score2 == 7)) {

    return true;
  }

  return false;
};

const updateMatchHandler = async (req, res) => {
  // try {
  //   const matchId = req.params.id;
  //   const data = req.body;
  //   await updateMatch(matchId, data);
  //   res.status(200).json({ data });
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
  try {
    const matchId = req.params.id;
    const { player_1_id, player_2_id, date, set1, set2, set3, manager_id } = req.body;

    if (isNaN(matchId) || matchId < 1) {
      res.status(400).json({ error: 'Invalid ID.' });
      return;
    }

    if (!player_1_id || !player_2_id || !date) {
      res.status(400).json({ error: 'Fields player_1_id, player_2_id, and date are required.' });
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

    const match = await getMatchById(matchId);
    if (match.length === 0) {
      res.status(404).json({ error: 'Match not found.' });
      return;
    }

    const tournament = await getTournamentById(match[0].tournament_id);
    if (tournament.length === 0) {
      res.status(404).json({ error: 'Tournament not found.' });
      return;
    }

    if (tournament[0].manager_id !== manager_id) {
      res.status(403).json({ error: 'You are not the manager of this tournament.' });
      return;
    }

    if (new Date(date) < new Date(tournament[0].start_date) || new Date(date) > new Date(tournament[0].end_date)) {
      res.status(400).json({ error: 'Match date is not within tournament dates.' });
      return;
    }

    if (!validateSetScore(set1)) {
      res.status(400).json({ error: 'Invalid set no. 1 score.' });
      return;
    }

    if (!validateSetScore(set2)) {
      res.status(400).json({ error: 'Invalid set no. 2 score.' });
      return;
    }

    const [set1Player1, set1Player2] = set1.split(":");
    const [set2Player1, set2Player2] = set2.split(":");
    if ((set1Player1 > set1Player2 && set2Player1 > set2Player2) || set1Player1 < set1Player2 && set2Player1 < set2Player2) {
      if (set3) {
        res.status(400).json({ error: 'Set no. 3 is not allowed.' });
        return;
      }
    } else {
      if (!validateSetScore(set3)) {
        res.status(400).json({ error: 'Invalid set no. 3 score.' });
        return;
      }
    }

    await updateMatch(matchId, player_1_id, player_2_id, date, set1, set2, set3);
    res.status(200).json({ message: 'Match updated.' });
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