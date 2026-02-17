require("dotenv").config();
const mongoose = require("mongoose");
const Song = require("../models/songModel");

const USER_ID = "698a37a2715dde06ab76386e"; // ← coloque o id do usuário

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const songs = [
    { title: "Bleed It Out", artist: "Linkin Park", audioUrl: "/uploads/Bleed It Out - Linkin Park.mp3", duration: 165, createdBy: USER_ID },
    { title: "BURN IT DOWN", artist: "Linkin Park", audioUrl: "/uploads/BURN IT DOWN - Linkin Park.mp3", duration: 230, createdBy: USER_ID },
    { title: "CASTLE OF GLASS", artist: "Linkin Park", audioUrl: "/uploads/CASTLE OF GLASS - Linkin Park.mp3", duration: 225, createdBy: USER_ID },
    { title: "Crawling", artist: "Linkin Park", audioUrl: "/uploads/Crawling - Linkin Park.mp3", duration: 210, createdBy: USER_ID },
    { title: "Faint", artist: "Linkin Park", audioUrl: "/uploads/Faint - Linkin Park.mp3", duration: 160, createdBy: USER_ID },
    { title: "Given Up", artist: "Linkin Park", audioUrl: "/uploads/Given Up - Linkin Park.mp3", duration: 190, createdBy: USER_ID },
    { title: "Good Things Go", artist: "Linkin Park", audioUrl: "/uploads/Good Things Go - Linkin Park.mp3", duration: 220, createdBy: USER_ID },
    { title: "Heavy Is the Crown", artist: "Linkin Park", audioUrl: "/uploads/Heavy Is the Crown - Linkin Park.mp3", duration: 215, createdBy: USER_ID },
    { title: "IN MY REMAINS", artist: "Linkin Park", audioUrl: "/uploads/IN MY REMAINS - Linkin Park.mp3", duration: 210, createdBy: USER_ID },
    { title: "In the End", artist: "Linkin Park", audioUrl: "/uploads/In the End - Linkin Park.mp3", duration: 216, createdBy: USER_ID },
    { title: "Iridescent", artist: "Linkin Park", audioUrl: "/uploads/Iridescent - Linkin Park.mp3", duration: 235, createdBy: USER_ID },
    { title: "Leave Out All The Rest", artist: "Linkin Park", audioUrl: "/uploads/Leave Out All The Rest - Linkin Park.mp3", duration: 215, createdBy: USER_ID },
    { title: "In The End (alt)", artist: "Linkin Park", audioUrl: "/uploads/Linkin Park - In The End  .mp3", duration: 216, createdBy: USER_ID },
    { title: "ROADS UNTRAVELED", artist: "Linkin Park", audioUrl: "/uploads/Linkin Park - ROADS UNTRAVELED .mp3", duration: 230, createdBy: USER_ID },
    { title: "What I've Done (alt)", artist: "Linkin Park", audioUrl: "/uploads/Linkin Park - What I've Done   .mp3", duration: 205, createdBy: USER_ID },
    { title: "LOST IN THE ECHO", artist: "Linkin Park", audioUrl: "/uploads/LOST IN THE ECHO - Linkin Park.mp3", duration: 230, createdBy: USER_ID },
    { title: "Lying from You", artist: "Linkin Park", audioUrl: "/uploads/Lying from You - Linkin Park.mp3", duration: 175, createdBy: USER_ID },
    { title: "New Divide", artist: "Linkin Park", audioUrl: "/uploads/New Divide - Linkin Park.mp3", duration: 248, createdBy: USER_ID },
    { title: "Numb", artist: "Linkin Park", audioUrl: "/uploads/Numb - Linkin Park.mp3", duration: 185, createdBy: USER_ID },
    { title: "One Step Closer", artist: "Linkin Park", audioUrl: "/uploads/One Step Closer - Linkin Park.mp3", duration: 156, createdBy: USER_ID },
    { title: "Somewhere I Belong", artist: "Linkin Park", audioUrl: "/uploads/Somewhere I Belong (Official Music Video)  4K UPGRADE  – Linkin Park - Linkin Park.mp3", duration: 215, createdBy: USER_ID },
    { title: "The Catalyst", artist: "Linkin Park", audioUrl: "/uploads/The Catalyst - Linkin Park.mp3", duration: 260, createdBy: USER_ID },
    { title: "The Emptiness Machine", artist: "Linkin Park", audioUrl: "/uploads/The Emptiness Machine - Linkin Park.mp3", duration: 210, createdBy: USER_ID },
    { title: "Two Faced", artist: "Linkin Park", audioUrl: "/uploads/Two Faced - Linkin Park.mp3", duration: 200, createdBy: USER_ID },
    { title: "Up From the Bottom", artist: "Linkin Park", audioUrl: "/uploads/Up From the Bottom - Linkin Park.mp3", duration: 210, createdBy: USER_ID },
    { title: "What I've Done", artist: "Linkin Park", audioUrl: "/uploads/What I've Done - Linkin Park.mp3", duration: 205, createdBy: USER_ID }
  ];

  await Song.deleteMany();
  await Song.insertMany(songs);

  console.log("🎵 TODAS as músicas foram inseridas!");
  process.exit();
}

seed();
