// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getUsers,
  getUserId,
  updateUser,
  deleteUser,
  getMyLikes,
  likeSong,
  unlikeSong,
} = require("../controllers/userController");

// 🔒 Todas as rotas protegidas com JWT

// ✅ Likes (tem que vir ANTES do "/:id")
router.get("/me/likes", auth, getMyLikes);
router.post("/me/likes/:songId", auth, likeSong);
router.delete("/me/likes/:songId", auth, unlikeSong);

// GET todos usuários
router.get("/", auth, getUsers);

// GET usuário por ID
router.get("/:id", auth, getUserId);

// UPDATE usuário
router.put("/:id", auth, updateUser);

// DELETE usuário
router.delete("/:id", auth, deleteUser);

module.exports = router;
