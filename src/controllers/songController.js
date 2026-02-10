// src/controllers/songController.js
const mongoose = require("mongoose");
const Song = require("../models/songModel");
const Playlist = require("../models/playlistModel");

// Helpers
function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/songs?q=&artist=&genre=&page=&limit=
const getSongs = async (req, res) => {
  try {
    const { q, artist, genre, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    if (artist) filter.artist = { $regex: artist, $options: "i" };
    if (genre) filter.genre = { $regex: genre, $options: "i" };

    const skip = (Math.max(parseInt(page, 10), 1) - 1) * Math.max(parseInt(limit, 10), 1);

    const [songs, total] = await Promise.all([
      Song.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Math.max(parseInt(limit, 10), 1))
          .populate("createdBy", "name email"),
      Song.countDocuments(filter)
    ]);

    res.status(200).json({
      data: songs,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.max(1, Math.ceil(total / Number(limit)))
      }
    });
  } catch (error) {
    console.error("getSongs error:", error);
    res.status(500).json({ message: "Erro ao buscar músicas" });
  }
};

// GET /api/songs/:id
const getSongId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: "Id inválido" });

    const song = await Song.findById(id).populate("createdBy", "name email");
    if (!song) return res.status(404).json({ message: "Música não encontrada" });

    res.status(200).json(song);
  } catch (error) {
    console.error("getSongId error:", error);
    res.status(500).json({ message: "Erro ao buscar música" });
  }
};

// POST /api/songs
// PROTEGIDO: deve ser chamado com Authorization: Bearer <token>
// createdBy será obtido de req.user.id (setado pelo auth middleware)
const createSong = async (req, res) => {
  try {
    // req.user is provided by auth middleware
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, artist, album, genre, duration, audioUrl } = req.body;

    if (!title || !artist || !duration || !audioUrl) {
      return res.status(400).json({ message: "Campos obrigatórios: title, artist, duration, audioUrl" });
    }

    if (typeof duration !== "number" && !/^\d+$/.test(duration)) {
      return res.status(400).json({ message: "Duration deve ser um número (segundos)" });
    }

    const song = new Song({
      title: title.trim(),
      artist: artist.trim(),
      album: album?.trim(),
      genre: genre?.trim(),
      duration: Number(duration),
      audioUrl: audioUrl.trim(),
      createdBy: userId
    });

    await song.save();
    await song.populate("createdBy", "name email");
    res.status(201).json(song);
  } catch (error) {
    console.error("createSong error:", error);
    res.status(400).json({ message: error.message || "Erro ao criar música" });
  }
};

// PUT /api/songs/:id
// PROTEGIDO: apenas o criador (createdBy) pode atualizar
const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: "Id inválido" });

    const song = await Song.findById(id);
    if (!song) return res.status(404).json({ message: "Música não encontrada" });

    // ownership check
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (song.createdBy && song.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only song owner can modify this song" });
    }

    // evita sobrescrever campos não permitidos (exemplo: plays, createdBy)
    const allowed = ["title","artist","album","genre","duration","audioUrl"];
    const update = {};
    for (const k of allowed) {
      if (k in req.body) update[k] = (typeof req.body[k] === "string" ? req.body[k].trim() : req.body[k]);
    }

    // se não houver campos válidos enviados
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "Nothing to update. Allowed fields: title, artist, album, genre, duration, audioUrl" });
    }

    const updated = await Song.findByIdAndUpdate(id, update, { new: true }).populate("createdBy", "name email");
    res.status(200).json(updated);
  } catch (error) {
    console.error("updateSong error:", error);
    res.status(400).json({ message: "Erro ao atualizar música" });
  }
};

// DELETE /api/songs/:id
// PROTEGIDO: apenas o criador pode deletar
const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: "Id inválido" });

    const song = await Song.findById(id);
    if (!song) return res.status(404).json({ message: "Música não encontrada" });

    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (song.createdBy && song.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only song owner can delete this song" });
    }

    const removed = await Song.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Música não encontrada (ou já removida)" });

    // remover referências da música em todas as playlists (estrutura: songs: [{ song: ObjectId, addedAt }])
    await Playlist.updateMany({}, { $pull: { songs: { song: removed._id } } });

    return res.status(200).json({ message: "Música removida", id: removed._id });
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
