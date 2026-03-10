const axios = require("axios");

async function proxyCover(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: "Missing url parameter" });
    }

    // valida formato da URL
    try {
      const parsed = new URL(url);

      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return res.status(400).json({ message: "Invalid url protocol" });
      }

    } catch {
      return res.status(400).json({ message: "Invalid url format" });
    }

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 10000,
    });

    const contentType = response.headers["content-type"] || "image/jpeg";

    // ✅ nova verificação: garantir que é imagem
    if (!contentType.startsWith("image/")) {
      return res.status(400).json({
        message: "URL does not point to an image",
      });
    }

    res.setHeader("Content-Type", contentType);

    // cache forte
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"
    );

    res.send(response.data);

  } catch (err) {
    console.error("cover proxy error:", err.message);

    res.status(500).json({
      message: "Failed to fetch cover",
    });
  }
}

module.exports = {
  proxyCover,
};