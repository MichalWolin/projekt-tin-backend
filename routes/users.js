var express = require('express');
var router = express.Router();
const { registerNewUserHandler } = require('../controllers/UsersController');
const cors = require('cors');

router.use(cors());

router.post('/', registerNewUserHandler);

module.exports = router;