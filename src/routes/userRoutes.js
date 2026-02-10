// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getUsers,
  getUserId,
  updateUser,
  deleteUser
} = require("../controllers/userController");

// 🔒 Todas as rotas protegidas com JWT

// GET todos usuários
router.get("/", auth, getUsers);

// GET usuário por ID
router.get("/:id", auth, getUserId);

// UPDATE usuário
router.put("/:id", auth, updateUser);
// router.patch("/:id", auth, updateUser); // opcional

// DELETE usuário
router.delete("/:id", auth, deleteUser);

module.exports = router;
