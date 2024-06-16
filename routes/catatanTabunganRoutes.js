const { createPersonalSavings } = require("../controllers/catatanTabunganController");
const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

router.post("/tabunganpribadi", authMiddleware, createPersonalSavings);

module.exports = router;
