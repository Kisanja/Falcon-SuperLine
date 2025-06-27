const Bus = require('../models/Bus');
const fs = require('fs');
const path = require('path');

const createBus = async (req, res) => {
  try {
    const {
      image, // optional if using file
      busNumber,
      brand,
      model,
      seatCapacity,
      type,
      insuranceExpiry
    } = req.body;

    // ✅ Use either uploaded file OR image URL from form
    const imagePath = req.file ? req.file.filename : image;

    if (!imagePath || !busNumber || !brand || !model || !seatCapacity || !type || !insuranceExpiry) {
      return res.status(400).json({ message: 'All fields including image or image URL are required.' });
    }

    const existing = await Bus.findOne({ busNumber });
    if (existing) {
      return res.status(409).json({ message: 'Bus number already exists.' });
    }

    const newBus = new Bus({
      image: imagePath,
      busNumber,
      brand,
      model,
      seatCapacity,
      type,
      insuranceExpiry
    });

    await newBus.save();
    res.status(201).json({ message: 'Bus created successfully', bus: newBus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(buses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch buses' });
  }
};

const updateBus = async (req, res) => {
  try {
    const busId = req.params.id;

    const {
      busNumber,
      brand,
      model,
      seatCapacity,
      type,
      insuranceExpiry
    } = req.body;

    const updatedData = {
      busNumber,
      brand,
      model,
      seatCapacity,
      type,
      insuranceExpiry
    };

    // If a new image is provided
    if (req.file) {
      updatedData.image = req.file.filename;
    } else if (req.body.image && req.body.image.startsWith('http')) {
      updatedData.image = req.body.image;
    }

    const updatedBus = await Bus.findByIdAndUpdate(busId, updatedData, { new: true });

    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.status(200).json({ message: 'Bus updated successfully', bus: updatedBus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBus = async (req, res) => {
  try {
    const busId = req.params.id;
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Delete the image file if it exists
    const imagePath = path.join(__dirname, '..', 'uploads', bus.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete the bus document
    await Bus.findByIdAndDelete(busId);

    res.status(200).json({ message: 'Bus and image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchBuses = async (req, res) => {
  try {
    const { q, type } = req.query;

    // Build dynamic filter object
    let filter = {};

    if (q) {
      const regex = new RegExp(q, 'i'); // case-insensitive
      filter.$or = [
        { busNumber: regex },
        { brand: regex },
        { model: regex }
      ];
    }

    if (type) {
      filter.type = type;
    }

    const buses = await Bus.find(filter);
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createBus,
  getAllBuses,
  updateBus,
  deleteBus,
  searchBuses
};
