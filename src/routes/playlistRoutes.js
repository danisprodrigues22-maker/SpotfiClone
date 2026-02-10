// src/routes/playlistRoutes.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
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
router.post("/", auth, createPlaylist);
router.put("/:id", auth, updatePlaylist);
router.delete("/:id", auth, deletePlaylist);
router.post("/:id/songs", auth, addSongToPlaylist);
router.delete("/:id/songs/:songId", auth, removeSongFromPlaylist);


module.exports = router;
