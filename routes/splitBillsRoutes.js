const express = require('express');
const router = express.Router();
const splitBillController = require('../controllers/splitBillsController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); // Assuming this is the correct path to your multer config

// Create a new bill
router.post('/berbagitagihan', [
    check('bill_name').not().isEmpty(),
    check('friends').isArray()
], authMiddleware, splitBillController.createBill);

// Add item to a bill
router.post('/berbagitagihan/:bill_id/items', [
    check('item_name').not().isEmpty(),
    check('amount').isNumeric(),
    check('price').isNumeric()
], authMiddleware, splitBillController.addItemToBill);

// Get bill details by ID
router.get('/berbagitagihan/:bill_id', authMiddleware, splitBillController.getBillById);

// Upload image for bill receipt
router.post('/berbagitagihan/:bill_id/upload', authMiddleware, upload, splitBillController.uploadImage);

module.exports = router;
