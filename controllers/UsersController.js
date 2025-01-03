const { get } = require('express/lib/response');
const { registerNewUser, checkCredentials, getUserById } = require('../models/UsersModel');

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

const checkCredentialsHandler = async (req, res) => {
  try {
    const credentials = req.body;
    const user = await checkCredentials(credentials);
    if (user.length === 0) {
      res.status(401).json({ message: 'Login or password is incorrect.' });
    } else {
      res.status(200).json({ user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByIdHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    if (user.length === 0) {
      res.status(404).json({ message: 'User not found.' });
    } else {
      res.status(200).json({ user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerNewUserHandler,
  checkCredentialsHandler,
  getUserByIdHandler
};