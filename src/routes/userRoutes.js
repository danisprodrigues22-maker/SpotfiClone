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
  addRecentPlay,
  getMyRecentPlays,
  getMyTopSongs,
} = require("../controllers/userController");

// 🔒 Todas as rotas protegidas com JWT

// ✅ Likes (tem que vir ANTES do "/:id")
router.get("/me/likes", auth, getMyLikes);
router.post("/me/likes/:songId", auth, likeSong);
router.delete("/me/likes/:songId", auth, unlikeSong);
router.get("/me/recent", auth, getMyRecentPlays);
router.get("/me/top", auth, getMyTopSongs);
router.post("/me/recent/:songId", auth, addRecentPlay);

// GET todos usuários
router.get("/", auth, getUsers);

// GET usuário por ID
router.get("/:id", auth, getUserId);

// UPDATE usuário
router.put("/:id", auth, updateUser);

// DELETE usuário
router.delete("/:id", auth, deleteUser);


module.exports = router;
