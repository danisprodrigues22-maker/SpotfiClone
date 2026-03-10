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

const incrementPlay = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } },
      { new: true }
    );

    res.status(200).json(song);
  } catch (err) {
    res.status(500).json({ message: "Error updating plays" });
  }
};

// GET /api/songs/top?limit=10
const getTopSongs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "10", 10);

    const songs = await Song.find()
      .sort({ plays: -1 })
      .limit(limit);

    return res.status(200).json({ songs });
  } catch (err) {
    console.error("getTopSongs error:", err);
    return res.status(500).json({ message: "Error fetching top songs" });
  }
};

// GET /api/songs/search?q=query
const searchSongs = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.status(200).json({ songs: [] });
    }

    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { artist: { $regex: q, $options: "i" } }
      ]
    })
      .sort({ plays: -1 })
      .limit(20);

    res.status(200).json({ songs });

  } catch (error) {
    console.error("searchSongs error:", error);
    res.status(500).json({ message: "Erro ao buscar músicas" });
  }
};

module.exports = {
  getSongs,
  getSongId,
  createSong,
  updateSong,
  deleteSong,
  incrementPlay,
  getTopSongs,
  searchSongs,
};
