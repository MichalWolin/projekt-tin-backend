var express = require('express');
var router = express.Router();
const { getPlayerByIdHandler } = require('../controllers/PlayersController');

router.get('/profile/:id', getPlayerByIdHandler);

module.exports = router;