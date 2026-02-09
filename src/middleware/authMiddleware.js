const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach useful data
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
