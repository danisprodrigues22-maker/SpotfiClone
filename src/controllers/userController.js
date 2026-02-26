// src/controllers/userController.js
const User = require("../models/userModel");
const Playlist = require("../models/playlistModel");
const Song = require("../models/songModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const LIKED_PLAYLIST_NAME = "Liked Songs";

// cria/garante a playlist "Liked Songs" do usuário e retorna ela
async function ensureLikedPlaylist(userId) {
  let pl = await Playlist.findOne({ owner: userId, name: LIKED_PLAYLIST_NAME });
  if (!pl) {
    pl = await Playlist.create({
      name: LIKED_PLAYLIST_NAME,
      description: "Músicas curtidas automaticamente",
      owner: userId,
      isPublic: false,
      songs: [],
    });
  }
  return pl;
}

// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // password já não vem por causa do select:false
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET USER BY ID
const getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User não encontrado" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "Id inválido" });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const removed = await User.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "User não encontrado" });
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: "Id inválido" });
  }
};

// UPDATE USER (com hash de senha)
const updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "User não encontrado" });

    const safeUser = updated.toObject();
    delete safeUser.password;

    return res.status(200).json(safeUser);
  } catch (error) {
    return res.status(400).json({ message: "Id inválido" });
  }
};

// GET /api/users/me/likes
const getMyLikes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("likedSongs");
    return res.status(200).json({ songs: user?.likedSongs || [] });
  } catch (err) {
    console.error("GET LIKES ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/me/likes/:songId
const likeSong = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { songId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!isValidObjectId(songId)) return res.status(400).json({ message: "Invalid songId" });

    const songExists = await Song.findById(songId).select("_id");
    if (!songExists) return res.status(404).json({ message: "Song not found" });

    // 1) adiciona no user.likedSongs
    await User.updateOne({ _id: userId }, { $addToSet: { likedSongs: songId } });

    // 2) garante a playlist "Liked Songs"
    const playlist = await ensureLikedPlaylist(userId);

    // 3) adiciona na playlist (sem duplicar)
    const alreadyAdded = playlist.songs.some((it) => it.song.toString() === songId);
    if (!alreadyAdded) {
      playlist.songs.push({ song: songId });
      await playlist.save();
    }

    return res.status(200).json({ message: "Liked" });
  } catch (err) {
    console.error("LIKE SONG ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/users/me/likes/:songId
const unlikeSong = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { songId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!isValidObjectId(songId)) return res.status(400).json({ message: "Invalid songId" });

    // 1) remove do user.likedSongs
    await User.updateOne({ _id: userId }, { $pull: { likedSongs: songId } });

    // 2) se existir playlist "Liked Songs", remove dela também
    const playlist = await Playlist.findOne({ owner: userId, name: LIKED_PLAYLIST_NAME });
    if (playlist) {
      playlist.songs = playlist.songs.filter((it) => it.song.toString() !== songId);
      await playlist.save();
    }

    return res.status(200).json({ message: "Unliked" });
  } catch (err) {
    console.error("UNLIKE SONG ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  getUserId,
  updateUser,
  deleteUser,
  getMyLikes,
  likeSong,
  unlikeSong,
};
