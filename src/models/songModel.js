//src/models/songModel.js
const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },

        artist: {
            type: String,
            required: true,
            trim: true
        },

        album: {
            type: String,
            trim: true
        },

        coverUrl: {
            type: String,
            default: "/uploads/covers/default.jpg",
        },


        genre: {
            type: String,
            trim: true
        },

        duration: {
            type: Number, // duração em segundos
            required: true,
            min: 1
        },

        audioUrl: {
            type: String, // caminho do arquivo ou URL do storage
            required: true,
            trim: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        plays: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
