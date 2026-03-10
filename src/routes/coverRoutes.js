const express = require("express");
const router = express.Router();

const { proxyCover } = require("../controllers/coverController");

router.get("/proxy", proxyCover);

module.exports = router;