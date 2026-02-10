// src/controllers/playlistController.js
const mongoose = require("mongoose");
const Playlist = require("../models/playlistModel");
const Song = require("../models/songModel");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/playlists
// PROTEGIDO: owner será obtido de req.user.id
const createPlaylist = async (req, res) => {
    try {
        const owner = req.user && req.user.id;
        if (!owner) return res.status(401).json({ message: "Unauthorized" });

        const { name, description, isPublic } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const playlist = await Playlist.create({
            name: name.trim(),
            description: description?.trim(),
            owner,
            isPublic: !!isPublic
        });

        res.status(201).json(playlist);
    } catch (error) {
        console.error("createPlaylist error:", error);
        res.status(500).json({ message: "Error creating playlist" });
    }
};

// GET /api/playlists
const getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(playlists);
    } catch (error) {
        console.error("getPlaylists error:", error);
        res.status(500).json({ message: "Error fetching playlists" });
    }
};

// GET /api/playlists/:id
const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid playlist id" });
        }

        const playlist = await Playlist.findById(id)
            .populate("owner", "name email")
            .populate("songs.song");

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        res.status(200).json(playlist);
    } catch (error) {
        console.error("getPlaylistById error:", error);
        res.status(500).json({ message: "Error fetching playlist" });
    }
};

// POST /api/playlists/:id/songs
// PROTEGIDO: apenas owner pode adicionar (decisão do projeto)
const addSongToPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { songId } = req.body;

        if (!isValidObjectId(id) || !isValidObjectId(songId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        if (playlist.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only playlist owner can modify the playlist" });
        }

        const songExists = await Song.findById(songId);
        if (!songExists) {
            return res.status(404).json({ message: "Song not found" });
        }

        const alreadyAdded = playlist.songs.some(
            (item) => item.song.toString() === songId
        );

        if (alreadyAdded) {
            return res.status(400).json({ message: "Song already in playlist" });
        }

        playlist.songs.push({ song: songId });
        await playlist.save();

        const populated = await Playlist.findById(playlist._id).populate("owner", "name email").populate("songs.song");
        res.status(200).json(populated);
    } catch (error) {
        console.error("addSongToPlaylist error:", error);
        res.status(500).json({ message: "Error adding song to playlist" });
    }
};

// DELETE /api/playlists/:id/songs/:songId
// PROTEGIDO: apenas owner pode remover
const removeSongFromPlaylist = async (req, res) => {
    try {
        const { id, songId } = req.params;

        if (!isValidObjectId(id) || !isValidObjectId(songId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        if (playlist.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only playlist owner can modify the playlist" });
        }

        playlist.songs = playlist.songs.filter(
            (item) => item.song.toString() !== songId
        );

        await playlist.save();

        const populated = await Playlist.findById(playlist._id).populate("owner", "name email").populate("songs.song");
        res.status(200).json(populated);
    } catch (error) {
        console.error("removeSongFromPlaylist error:", error);
        res.status(500).json({ message: "Error removing song from playlist" });
    }
};

// DELETE /api/playlists/:id
// PROTEGIDO: apenas owner pode deletar
const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid playlist id" });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        if (playlist.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only playlist owner can delete the playlist" });
        }

        await Playlist.findByIdAndDelete(id);

        res.status(200).json({ message: "Playlist deleted successfully" });
    } catch (error) {
        console.error("deletePlaylist error:", error);
        res.status(500).json({ message: "Error deleting playlist" });
    }
};

// PUT /api/playlists/:id
// PROTEGIDO: apenas owner pode atualizar metadata (name, description, isPublic)
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid playlist id" });
    }

    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ message: "Only playlist owner can modify the playlist" });
    }

    const { name, description, isPublic } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Nothing to update. Allowed fields: name, description, isPublic"
      });
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(id, updateData, { new: true })
      .populate("owner", "name email")
      .populate("songs.song");

    return res.status(200).json(updatedPlaylist);

  } catch (error) {
    console.error("updatePlaylist error:", error);
    return res.status(500).json({ message: "Error updating playlist" });
  }
};

module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    updatePlaylist
};
