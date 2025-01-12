var express = require('express');
var router = express.Router();
const {
    getMatchesHandler,
    addMatchHandler
} = require('../controllers/MatchesController');

router.get('/:id', getMatchesHandler);
router.post('/:id', addMatchHandler);

module.exports = router;