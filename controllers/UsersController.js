const { registerNewUser } = require('../models/UsersModel');

//TODO: Poprawne kody odpowiedzi
const registerNewUserHandler = async (req, res) => {
  try {
    const user = req.body;
    await registerNewUser(user);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerNewUserHandler
};