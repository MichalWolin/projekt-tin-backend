var express = require('express');
var router = express.Router();
const { registerNewUserHandler, checkCredentialsHandler, getUserByIdHandler } = require('../controllers/UsersController');

router.post('/register', registerNewUserHandler);
router.post('/login', checkCredentialsHandler);
router.get('/profile/:id', getUserByIdHandler);

module.exports = router;