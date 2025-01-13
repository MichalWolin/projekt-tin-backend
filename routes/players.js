var express = require('express');
var router = express.Router();
const {
  getPlayerByIdHandler,
  getEligiblePlayersHandler,
  getRankingHandler,
  getPlayersMatchesHandler
} = require('../controllers/PlayersController');

router.get('/profile/:id', getPlayerByIdHandler);
router.get('/eligible/:id', getEligiblePlayersHandler);
router.get('/ranking', getRankingHandler);
router.get('/matches/:id', getPlayersMatchesHandler);

module.exports = router;