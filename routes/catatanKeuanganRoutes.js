const { getPemasukanById, createNewPemasukan, getPengeluaranById, createNewPengeluaran, getLaporanKeuangan } = require("../controllers/catatanKeuanganController");

const authMiddleware = require("../middleware/authMiddleware");

const { checkSchema } = require("express-validator");
const express = require("express");
const router = require("express").Router();

router.get("/catatankeuangan/pemasukan", authMiddleware, getPemasukanById);
router.post("/catatankeuangan/pemasukan", authMiddleware, createNewPemasukan);
router.get("/catatankeuangan/pengeluaran", authMiddleware, getPengeluaranById);
router.post("/catatankeuangan/pengeluaran", authMiddleware, createNewPengeluaran);
router.post("/catatankeuangan/laporan", authMiddleware, getLaporanKeuangan);

module.exports = router;