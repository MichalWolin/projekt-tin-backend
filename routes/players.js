var express = require('express');
var router = express.Router();
const {
  getPlayerByIdHandler,
  getEligiblePlayersHandler
} = require('../controllers/PlayersController');

router.get('/profile/:id', getPlayerByIdHandler);
router.get('/eligible/:id', getEligiblePlayersHandler);

module.exports = router;