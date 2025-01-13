var express = require('express');
var router = express.Router();
const {
  registerNewUserHandler,
  checkCredentialsHandler,
  getUserByIdHandler,
  updateUserDataHandler,
  updatePasswordHandler,
  deleteUserHandler
} = require('../controllers/UsersController');

router.post('/register', registerNewUserHandler);
router.post('/login', checkCredentialsHandler);
router.get('/data/:id', getUserByIdHandler);
router.put('/data/:id', updateUserDataHandler);
router.put('/password', updatePasswordHandler);
router.delete('/:id', deleteUserHandler);

module.exports = router;