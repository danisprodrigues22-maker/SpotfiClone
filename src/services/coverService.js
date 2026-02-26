const axios = require("axios");

async function fetchCoverUrl(title, artist) {
  try {
    const term = `${artist} ${title}`;

    const { data } = await axios.get("https://itunes.apple.com/search", {
      params: {
        term,
        entity: "song",
        limit: 1,
      },
    });

    if (data.results.length > 0) {
      // aumenta resolução da imagem
      return data.results[0].artworkUrl100.replace("100x100bb", "600x600bb");
    }

    return null;
  } catch (err) {
    console.log("Erro ao buscar capa:", err.message);
    return null;
  }
}

module.exports = { fetchCoverUrl };
