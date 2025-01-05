var express = require('express');
var router = express.Router();
const {
	getTournamentsHandler,
	addTournamentHandler,
	removeTournamentHandler
} = require('../controllers/TournamentsController');

router.get('/', getTournamentsHandler);
router.post('/', addTournamentHandler);
router.delete('/:id', removeTournamentHandler);

module.exports = router;