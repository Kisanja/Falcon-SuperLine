const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { createBus, getAllBuses, updateBus, deleteBus, searchBuses } = require('../controllers/busController');

// ✅ Ensure /uploads folder exists
const uploadPath = 'uploads/';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ✅ Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Create a new bus (supports image or image URL)
router.post('/', upload.single('image'), createBus);

// ✅ Get all buses
router.get('/', getAllBuses);

//Update the bus
router.put('/:id', upload.single('image'), updateBus);

//Delete the bus
router.delete('/:id', deleteBus);

//Search the bus
router.get('/search', searchBuses);




module.exports = router;
