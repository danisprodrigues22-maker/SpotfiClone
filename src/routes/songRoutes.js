// songRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSongs,
  getSongId,
  createSong,
  updateSong,
  deleteSong
} = require("../controllers/songController");

// list + filtros: GET /api/songs?q=&artist=&genre=&page=&limit=
router.get("/", getSongs);

// detalhes
router.get("/:id", getSongId);

// criar (sem upload de arquivo - espera audioUrl no body por enquanto)
router.post("/", createSong);

// atualizar
router.put("/:id", updateSong);

// deletar
router.delete("/:id", deleteSong);

module.exports = router;
