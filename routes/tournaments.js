var express = require('express');
var router = express.Router();
const {
	getTournamentsHandler,
	addTournamentHandler
} = require('../controllers/TournamentsController');

router.get('/', getTournamentsHandler);
router.post('/', addTournamentHandler);

module.exports = router;