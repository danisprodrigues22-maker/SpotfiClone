// src/controllers/userController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

// GET ALL USERS
const getUsers = async (req, res) => { 
  try {
    const users = await User.find(); // password já não vem por causa do select:false
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET USER BY ID
const getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User não encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "Id inválido" });
  }
};

// CREATE USER (com hash)


// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const removed = await User.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ message: "User não encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: "Id inválido" });
  }
};

// UPDATE USER (com hash de senha)
const updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User não encontrado" });
    }

    const safeUser = updated.toObject();
    delete safeUser.password;

    return res.status(200).json(safeUser);
  } catch (error) {
    return res.status(400).json({ message: "Id inválido" });
  }
};

module.exports = {
  getUsers,
  getUserId,
  updateUser,
  deleteUser
};
