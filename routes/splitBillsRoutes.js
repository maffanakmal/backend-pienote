const express = require('express');
const router = express.Router();
const splitBillController = require('../controllers/splitBillsController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); // Assuming this is the correct path to your multer config

// Create a new bill
router.post('/berbagitagihan', authMiddleware, splitBillController.createBill);

// Add item to a bill
router.post('/berbagitagihan/:bill_id/items', authMiddleware, splitBillController.addItemToBill);

// Get bill details by ID
router.get('/berbagitagihan/:bill_id', authMiddleware, splitBillController.getBillById);

// Upload image for bill receipt
router.post('/berbagitagihan/:bill_id/upload', authMiddleware, upload, splitBillController.uploadImage);

module.exports = router;
