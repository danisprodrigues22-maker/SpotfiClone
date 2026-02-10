//src/app.js
const express = require("express");

const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const songRoutes = require("./routes/songRoutes");
const playlistRoutes = require("./routes/playlistRoutes");

const app = express();



app.use(bodyParser.json());



app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);

module.exports = app;




