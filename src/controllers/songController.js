// songController.js
const mongoose = require("mongoose");
const Song = require("../models/songModel"); // seu model exporta Music, aqui chamamos de Song
const Playlist = require("../models/playlistModel"); // para limpar referências quando deletar

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
      // busca por título (case-insensitive)
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
          .populate("createdBy", "name email"), // popula informações do criador
      Song.countDocuments(filter)
    ]);

    res.status(200).json({
      data: songs,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit) || 1)
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
// Nota: enquanto não tiver autenticação, passe createdBy no body como userId
const createSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration, audioUrl, createdBy } = req.body;

    // validações básicas
    if (!title || !artist || !duration || !audioUrl || !createdBy) {
      return res.status(400).json({ message: "Campos obrigatórios: title, artist, duration, audioUrl, createdBy" });
    }
    if (typeof duration !== "number" && !/^\d+$/.test(duration)) {
      return res.status(400).json({ message: "Duration deve ser um número (segundos)" });
    }
    if (!isObjectId(createdBy)) {
      return res.status(400).json({ message: "createdBy deve ser um ObjectId válido" });
    }

    const song = new Song({
      title: title.trim(),
      artist: artist.trim(),
      album: album?.trim(),
      genre: genre?.trim(),
      duration: Number(duration),
      audioUrl: audioUrl.trim(),
      createdBy
    });

    await song.save();
    // popula o campo createdBy antes de devolver
    await song.populate("createdBy", "name email");
    res.status(201).json(song);
  } catch (error) {
    console.error("createSong error:", error);
    // se for erro de validação do mongoose, devolve mensagem
    res.status(400).json({ message: error.message || "Erro ao criar música" });
  }
};

// PUT /api/songs/:id
const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: "Id inválido" });

    // evita sobrescrever campos não permitidos (exemplo: plays direto)
    const allowed = ["title","artist","album","genre","duration","audioUrl"];
    const update = {};
    for (const k of allowed) {
      if (k in req.body) update[k] = (typeof req.body[k] === "string" ? req.body[k].trim() : req.body[k]);
    }

    const updated = await Song.findByIdAndUpdate(id, update, { new: true }).populate("createdBy", "name email");
    if (!updated) return res.status(404).json({ message: "Música não encontrada" });

    res.status(200).json(updated);
  } catch (error) {
    console.error("updateSong error:", error);
    res.status(400).json({ message: "Erro ao atualizar música" });
  }
};

// DELETE /api/songs/:id
const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: "Id inválido" });

    const removed = await Song.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Música não encontrada" });

    // opcional: remover referências da música em todas as playlists
    await Playlist.updateMany({}, { $pull: { songs: removed._id } });

    // 204 No Content é ok, mas devolver o id pode ajudar no front
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
