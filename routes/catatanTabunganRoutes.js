const { createPersonalSavings, createPersonalCurrentSaving, createGroupSavings } = require("../controllers/catatanTabunganController");
const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

router.post("/tabunganpribadi", authMiddleware, createPersonalSavings);
router.post("/detailtabunganpribadi/:personalsaving_id", authMiddleware, createPersonalCurrentSaving);
router.post("/tabunganbersama", authMiddleware, createGroupSavings);

module.exports = router;
