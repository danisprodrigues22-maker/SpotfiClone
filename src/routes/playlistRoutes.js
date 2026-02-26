// src/routes/playlistRoutes.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { playlistSchema } = require("../validation/schemas");

const router = express.Router();

const {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
  getMyLikedPlaylist,
  updatePlaylist
} = require("../controllers/playlistController");

// ✅ Rota especial tem que vir ANTES do "/:id"
router.get("/me/liked", auth, getMyLikedPlaylist);

// Listar playlists públicas
router.get("/", getPlaylists);

// Buscar playlist por ID
router.get("/:id", getPlaylistById);

// Criar playlist
router.post("/", auth, validate(playlistSchema), createPlaylist);

// Atualizar playlist
router.put(
  "/:id",
  auth,
  validate(
    playlistSchema.fork(["name", "description", "isPublic"], (s) => s.optional())
  ),
  updatePlaylist
);

// Deletar playlist
router.delete("/:id", auth, deletePlaylist);

// Adicionar música
router.post("/:id/songs", auth, addSongToPlaylist);

// Remover música
router.delete("/:id/songs/:songId", auth, removeSongFromPlaylist);

module.exports = router;
