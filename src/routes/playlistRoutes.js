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
  updatePlaylist
} = require("../controllers/playlistController");

router.get("/", getPlaylists);
router.get("/:id", getPlaylistById);

// Criar playlist (validado)
router.post("/", auth, validate(playlistSchema), createPlaylist);

// Atualizar playlist (validação parcial)
router.put("/:id", auth, validate(playlistSchema.fork(["name","description","isPublic"], s => s.optional())), updatePlaylist);

router.delete("/:id", auth, deletePlaylist);
router.post("/:id/songs", auth, addSongToPlaylist);
router.delete("/:id/songs/:songId", auth, removeSongFromPlaylist);

module.exports = router;
