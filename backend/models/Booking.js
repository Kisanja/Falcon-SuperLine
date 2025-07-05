const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusRouteAssignment',
    required: true
  },
  seatNumbers: {
    type: [Number],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Confirmed'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
