// src/routes/songRoutes.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const {
  getSongs,
  getSongId,
  createSong,
  updateSong,
  deleteSong
} = require("../controllers/songController");

router.get("/", getSongs);
router.get("/:id", getSongId);
router.post("/", auth, createSong);
router.put("/:id", auth, updateSong);
router.delete("/:id", auth, deleteSong);

module.exports = router;
