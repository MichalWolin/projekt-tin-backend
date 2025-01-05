var express = require('express');
var router = express.Router();
const {
    getMatchesHandler
} = require('../controllers/MatchesController');

router.get('/:id', getMatchesHandler);

module.exports = router;