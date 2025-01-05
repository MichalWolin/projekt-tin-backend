var express = require('express');
var router = express.Router();
const {
	getTournamentsHandler,
	addTournamentHandler,
	removeTournamentHandler,
	getTournamentByIdHandler,
	updateTournamentHandler,
	getTournamentManagerByIdHandler
} = require('../controllers/TournamentsController');

router.get('/', getTournamentsHandler);
router.post('/', addTournamentHandler);
router.delete('/:id', removeTournamentHandler);
router.get('/:id', getTournamentByIdHandler);
router.put('/:id', updateTournamentHandler);
router.get('/manager/:id', getTournamentManagerByIdHandler);

module.exports = router;