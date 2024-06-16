const { getUserById, updateUserById } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

router.get("/profile", authMiddleware, getUserById);

module.exports = router;
