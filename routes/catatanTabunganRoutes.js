const { 
    createPersonalSavings, 
    getPersonalSavings, 
    updatePersonalSavings, 
    getPersonalSavingsDetail, 
    getPersonalCurrentSavings, 
    createPersonalCurrentSaving, 
    deletePersonalSavings, getGroupSavings, 
    createGroupSavings,
    deleteGroupSavings,
    getGroupSavingsDetail,
    updateGroupSavings
} = require("../controllers/catatanTabunganController");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

router.get('/catatantabungan/pribadi', authMiddleware, getPersonalSavings);
router.get('/catatantabungan/bersama', authMiddleware, getGroupSavings);

router.post("/tabunganpribadi", authMiddleware, createPersonalSavings);
router.post("/tabunganbersama", authMiddleware, createGroupSavings);

router.get("/detailtabunganpribadi/:personalsaving_id", authMiddleware, getPersonalSavingsDetail);
router.post("/detailtabunganpribadi/:personalsaving_id", authMiddleware, updatePersonalSavings);
router.delete("/detailtabunganpribadi/:personalsaving_id", authMiddleware, deletePersonalSavings);

router.get("/detailtabunganbersama/:groupsavings_id", authMiddleware, getGroupSavingsDetail);
router.post("/detailtabunganbersama/:groupsavings_id", authMiddleware, updateGroupSavings);
router.delete("/detailtabunganbersama/:groupsavings_id", authMiddleware, deleteGroupSavings);

router.get("/detailtabunganpribadi/:personalsaving_id/currentsavings", authMiddleware, getPersonalCurrentSavings);
router.post("/detailtabunganpribadi/:personalsaving_id/currentsavings", authMiddleware, createPersonalCurrentSaving);

module.exports = router;
