// src/validation/schemas.js
const Joi = require("joi");

// Auth
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Song (POST)
const songSchema = Joi.object({
  title: Joi.string().min(2).required(),
  artist: Joi.string().min(1).required(),
  album: Joi.string().allow("", null),
  genre: Joi.string().allow("", null),
  // duration: aceita número (segundos) ou string numérica
  duration: Joi.alternatives().try(Joi.number().integer().min(1), Joi.string().pattern(/^\d+$/)).required(),
  // audioUrl: se você usa URLs públicas, use .uri(); se usa caminhos locais, mantenha string simples
  audioUrl: Joi.string().min(1).required()
});

// Song update (PUT) - todos os campos opcionais
const songUpdateSchema = songSchema.fork(
  ["title", "artist", "album", "genre", "duration", "audioUrl"],
  (schema) => schema.optional()
);

// Playlist
const playlistSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow("", null),
  isPublic: Joi.boolean().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  songSchema,
  songUpdateSchema,
  playlistSchema
};
