const mongoose = require('mongoose');

const busRouteAssignmentSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  scheduleType: {
    type: String,
    enum: ['Every Day', 'Specific Date'],
    required: true
  },
  date: {
    type: Date // Only used if scheduleType is 'Specific Date'
  },
  // FORWARD TRIP (Main → Secondary)
  forwardDepartureTime: {
    type: String, // 'HH:mm'
    required: true
  },
  forwardArrivalTime: {
    type: String,
    required: true
  },
  // RETURN TRIP (Secondary → Main)
  returnDepartureTime: {
    type: String,
    required: true
  },
  returnArrivalTime: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('BusRouteAssignment', busRouteAssignmentSchema);
