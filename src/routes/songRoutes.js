// src/routes/songRoutes.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { songSchema, songUpdateSchema } = require("../validation/schemas");

const router = express.Router();
const {
  getSongs,
  getSongId,
  createSong,
  updateSong,
  deleteSong,
  incrementPlay,
  getTopSongs,
  searchSongs
} = require("../controllers/songController");

router.get("/top", getTopSongs);
router.get("/search", searchSongs);
router.get("/", getSongs);
router.get("/:id", getSongId);
// validação aplicada: criar música exige schema completo
router.post("/", auth, validate(songSchema), createSong);
// na atualização, campos permitidos são opcionais
router.put("/:id", auth, validate(songUpdateSchema), updateSong);
router.delete("/:id", auth, deleteSong);
router.patch("/:id/play", incrementPlay);

module.exports = router;
