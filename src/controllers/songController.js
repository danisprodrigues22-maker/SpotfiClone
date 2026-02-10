// src/controllers/songController.js
const mongoose = require("mongoose");
const Song = require("../models/songModel");
const Playlist = require("../models/playlistModel");

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/songs
const getSongs = async (req, res) => {
  try {
    const songs = await Song.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(songs);
  } catch (error) {
    console.error("getSongs error:", error);
    res.status(500).json({ message: "Erro ao buscar músicas" });
  }
};

// GET /api/songs/:id
const getSongId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const song = await Song.findById(id).populate("createdBy", "name email");
    if (!song) {
      return res.status(404).json({ message: "Música não encontrada" });
    }

    res.status(200).json(song);
  } catch (error) {
    console.error("getSongId error:", error);
    res.status(500).json({ message: "Erro ao buscar música" });
  }
};

// POST /api/songs (PROTEGIDO)
const createSong = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const song = await Song.create({
      ...req.body,
      duration: Number(req.body.duration),
      createdBy: userId
    });

    await song.populate("createdBy", "name email");
    res.status(201).json(song);

  } catch (error) {
    console.error("createSong error:", error);
    res.status(400).json({ message: "Erro ao criar música" });
  }
};

// PUT /api/songs/:id (PROTEGIDO)
const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Música não encontrada" });
    }

    const userId = req.user?.id;
    if (song.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(song, req.body);
    if (req.body.duration) {
      song.duration = Number(req.body.duration);
    }

    await song.save();
    await song.populate("createdBy", "name email");

    res.status(200).json(song);

  } catch (error) {
    console.error("updateSong error:", error);
    res.status(400).json({ message: "Erro ao atualizar música" });
  }
};

// DELETE /api/songs/:id (PROTEGIDO)
const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Música não encontrada" });
    }

    const userId = req.user?.id;
    if (song.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Song.findByIdAndDelete(id);
    await Playlist.updateMany({}, { $pull: { songs: { song: id } } });

    res.status(200).json({ message: "Música removida com sucesso" });

  } catch (error) {
    console.error("deleteSong error:", error);
    res.status(400).json({ message: "Erro ao deletar música" });
  }
};

module.exports = {
  getSongs,
  getSongId,
  createSong,
  updateSong,
  deleteSong
};
