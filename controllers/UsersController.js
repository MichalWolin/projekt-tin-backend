const {
  registerNewUser,
  checkCredentials,
  getUserById,
  updateUserData,
  checkCredentialsById,
  updatePassword,
  deleteUser
} = require('../models/UsersModel');

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

const updateUserDataHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await updateUserData(id, data);
    res.status(200).json({ id, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePasswordHandler = async (req, res) => {
  try {
    const { old_password, new_password, repeat_new_password, user_id } = req.body;
    const id = req.params.id;

    if (id !== user_id) {
      res.status(403).json({ error: `You are not allowed to change another user's password.` });
      return;
    }

    if (!old_password || !new_password || !repeat_new_password) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    const user = await checkCredentialsById(user_id, old_password);
    if (user.length === 0) {
      res.status(401).json({ error: 'Old password is incorrect.' });
      return;
    }

    if (/\s/.test(new_password)) {
      res.status(400).json({ error: 'Password cannot contain spaces.' });
      return;
    }

    if (new_password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      return;
    }

    if (!/\d/.test(new_password)) {
      res.status(400).json({ error: 'Password must contain a digit.' });
      return;
    }

    if (!/[!@#$%]/.test(new_password)) {
      res.status(400).json({ error: 'Password must contain a special character (!, @, #, $, %).' });
      return;
    }

    if (new_password !== repeat_new_password) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    await updatePassword(user_id, new_password);
    res.status(200).json({ message: 'Password updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const id = req.params.id;

    if (id != user_id) {
      res.status(403).json({ error: `You are not allowed to delete another user's account.` });
      return;
    }

    await deleteUser(id);
    res.status(200).json({ message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerNewUserHandler,
  checkCredentialsHandler,
  getUserByIdHandler,
  updateUserDataHandler,
  updatePasswordHandler,
  deleteUserHandler
};