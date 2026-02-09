//playlistController.js
const mongoose = require("mongoose");
const Playlist = require("../models/playlistModel");
const Song = require("../models/songModel");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/playlists
const createPlaylist = async (req, res) => {
    try {
        const { name, description, owner, isPublic } = req.body;

        if (!name || !owner) {
            return res.status(400).json({ message: "Name and owner are required" });
        }

        if (!isValidObjectId(owner)) {
            return res.status(400).json({ message: "Invalid owner id" });
        }

        const playlist = await Playlist.create({
            name,
            description,
            owner,
            isPublic
        });

        res.status(201).json(playlist);
    } catch (error) {
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
        res.status(500).json({ message: "Error fetching playlist" });
    }
};

// POST /api/playlists/:id/songs
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

        res.status(200).json(playlist);
    } catch (error) {
        res.status(500).json({ message: "Error adding song to playlist" });
    }
};

// DELETE /api/playlists/:id/songs/:songId
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

        playlist.songs = playlist.songs.filter(
            (item) => item.song.toString() !== songId
        );

        await playlist.save();

        res.status(200).json(playlist);
    } catch (error) {
        res.status(500).json({ message: "Error removing song from playlist" });
    }
};

// DELETE /api/playlists/:id
const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid playlist id" });
        }

        const playlist = await Playlist.findByIdAndDelete(id);

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        res.status(200).json({ message: "Playlist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting playlist" });
    }
};

const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid playlist id" });
    }

    const { name, description, isPublic } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (isPublic !== undefined) {
      updateData.isPublic = isPublic;
    }

    // Segurança: se nenhum campo válido foi enviado
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Nothing to update. Allowed fields: name, description, isPublic"
      });
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate("owner", "name email")
      .populate("songs.song");

    if (!updatedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

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
