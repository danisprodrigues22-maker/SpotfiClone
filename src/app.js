// src/app.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const songRoutes = require("./routes/songRoutes");
const playlistRoutes = require("./routes/playlistRoutes");

const app = express();

/* ✅ TRUST PROXY (importante para Render/Heroku) */
app.set("trust proxy", 1);

/* -------------------- PARSERS -------------------- */
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* -------------------- SEGURANÇA -------------------- */
app.use(helmet());

app.use(cors()); // em produção: limitar origin

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(mongoSanitize());
app.use(xss());

/* -------------------- ROTAS -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);

/* -------------------- 404 -------------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

/* -------------------- ERROR HANDLER GLOBAL -------------------- */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  const status = err.status || 500;
  const response = {
    message: err.message || "Internal server error"
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(status).json(response);
});

module.exports = app;
