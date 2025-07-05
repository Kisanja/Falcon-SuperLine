const express = require('express');
const router = express.Router();
const { createBooking, getBookedSeats, getBookingsByCustomer, cancelBooking } = require('../controllers/bookingController');

// POST: Create new booking
router.post('/', createBooking);

router.get('/booked/:assignmentId', getBookedSeats);

router.get('/customer/:customerId', getBookingsByCustomer);

router.put('/cancel/:bookingId', cancelBooking);

module.exports = router;
