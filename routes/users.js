var express = require('express');
var router = express.Router();
const { registerNewUserHandler, checkCredentialsHandler, getUserByIdHandler, updateUserDataHandler } = require('../controllers/UsersController');

router.post('/register', registerNewUserHandler);
router.post('/login', checkCredentialsHandler);
router.get('/data/:id', getUserByIdHandler);
router.put('/data/:id', updateUserDataHandler);

module.exports = router;