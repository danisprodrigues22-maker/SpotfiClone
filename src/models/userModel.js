//src/models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    { 
        name: {
            type: String,
            required: true,
            minlength: 2,
            trim: true 
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
  type: String,
  required: true,
  select: false
},
likedSongs: [
  { type: require("mongoose").Schema.Types.ObjectId, ref: "Song", default: [] }
],
recentPlays: [
  {
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
    playedAt: { type: Date, default: Date.now }
  }
]

    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;