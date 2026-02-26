require("dotenv").config();
const mongoose = require("mongoose");
const Song = require("../models/songModel");
const { fetchCoverUrl } = require("../services/coverService");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const songs = await Song.find();

  console.log(`🎵 Encontradas ${songs.length} músicas`);

  for (const song of songs) {
    console.log(`Buscando capa: ${song.artist} - ${song.title}`);

    const cover = await fetchCoverUrl(song.title, song.artist);

    if (cover) {
      song.coverUrl = cover;
      await song.save();
      console.log("✅ Atualizada");
    } else {
      console.log("⚠️ Não encontrada, mantendo default");
    }
  }

  console.log("🎉 Finalizado");
  process.exit();
}

run();
