//userRoutes.js
const express = require("express");
const router = express.Router();
const {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    getUserId
} = require("../controllers/userController");

router.get("/", getUsers);
router.get("/:id", getUserId);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;