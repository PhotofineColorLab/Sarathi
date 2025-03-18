const express = require('express');
const router = express.Router();
const { uploadOrderImage, deleteOrderImage } = require('../controllers/uploadController');

// Route to upload an image
router.post('/orders', uploadOrderImage);

// Route to delete an image by public ID
router.delete('/orders/:publicId', deleteOrderImage);

module.exports = router; 