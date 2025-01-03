const { getPlayerById } = require('../models/PlayersModel');

const getPlayerByIdHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getPlayerById(id);
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
  getPlayerByIdHandler
};