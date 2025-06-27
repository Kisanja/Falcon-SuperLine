const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true,
  },
  permitNumber: {
    type: String,
    required: true,
    unique: true,
  },
  mainTown: {
    type: String,
    required: true,
  },
  secondaryTown: {
    type: String,
    required: true,
  },
  routeType: {
    type: String,
    enum: ['Short Distance', 'Long Distance', 'Highway Express'], // ✅ Updated names
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0 // Optional: ensures price can't be negative
  }
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
