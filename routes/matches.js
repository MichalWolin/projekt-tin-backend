var express = require('express');
var router = express.Router();
const {
  getMatchesHandler,
  addMatchHandler,
  removeMatchHandler,
  getMatchByIdHandler,
  updateMatchHandler
} = require('../controllers/MatchesController');

router.get('/:id', getMatchesHandler);
router.post('/:id', addMatchHandler);
router.delete('/:id', removeMatchHandler);
router.get('/match/:id', getMatchByIdHandler);
router.put('/match/:id', updateMatchHandler);

module.exports = router;