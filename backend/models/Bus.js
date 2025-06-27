const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  image: {
    type: String, // Stores filename or image URL
    required: true
  },
  busNumber: {
    type: String,
    required: true,
    unique: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  seatCapacity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Normal', 'Semi luxury', 'A/C', 'Luxury'],
    required: true
  },
  insuranceExpiry: {
    type: Date,
    required: true
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Assuming Employee model includes role 'Driver'
    default: null
  },
  assignedConductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Assuming Employee model includes role 'Conductor'
    default: null
  },
  assignedGarage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garage',
    default: null
  },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
