const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validation/schemas");

const { register, login, me } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", auth, me);

module.exports = router;
