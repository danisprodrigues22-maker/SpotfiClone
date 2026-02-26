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


    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;