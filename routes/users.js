var express = require('express');
var router = express.Router();
const { registerNewUserHandler } = require('../controllers/UsersController');

router.post('/', registerNewUserHandler);

module.exports = router;