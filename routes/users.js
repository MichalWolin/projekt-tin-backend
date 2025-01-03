var express = require('express');
var router = express.Router();
const { registerNewUserHandler, checkCredentialsHandler } = require('../controllers/UsersController');

router.post('/register', registerNewUserHandler);
router.post('/login', checkCredentialsHandler);

module.exports = router;