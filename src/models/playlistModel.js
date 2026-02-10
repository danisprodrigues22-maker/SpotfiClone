// src/models/playlistModel.js
const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },

        description: {
            type: String,
            trim: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        songs: [
            {
                song: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Song",
                    required: true
                },
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        isPublic: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
