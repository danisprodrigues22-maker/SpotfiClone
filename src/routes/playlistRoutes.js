// playlistRoutes.js
const express = require("express");
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

router.post("/", createPlaylist);
router.get("/", getPlaylists);
router.get("/:id", getPlaylistById);
router.delete("/:id", deletePlaylist);


router.post("/:id/songs", addSongToPlaylist);
router.delete("/:id/songs/:songId", removeSongFromPlaylist);
router.put("/:id", updatePlaylist);

module.exports = router;
