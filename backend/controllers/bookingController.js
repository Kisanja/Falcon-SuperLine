const Booking = require('../models/Booking');
const BusRouteAssignment = require('../models/BusRouteAssignment');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { customerId, assignmentId, seatNumbers, bookingDate } = req.body;

    if (!customerId || !assignmentId || !seatNumbers || seatNumbers.length === 0 || !bookingDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const assignment = await BusRouteAssignment.findById(assignmentId)
      .populate('busId')
      .populate('routeId');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Normalize date
    const selectedDate = new Date(bookingDate);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Get all bookings on this assignment for the selected date
    const existingBookings = await Booking.find({
      assignmentId,
      bookingDate: {
        $gte: selectedDate,
        $lt: nextDate,
      },
      status: 'Confirmed',
    });

    const alreadyBookedSeats = existingBookings.flatMap(b => b.seatNumbers);

    const hasConflict = seatNumbers.some(seat => alreadyBookedSeats.includes(seat));
    if (hasConflict) {
      return res.status(409).json({ message: 'Some selected seats are already booked for this date.' });
    }

    const totalPrice = assignment.routeId.ticketPrice * seatNumbers.length;

    const newBooking = new Booking({
      customerId,
      busId: assignment.busId._id,
      assignmentId,
      seatNumbers,
      totalPrice,
      bookingDate: selectedDate,
      status: 'Confirmed'
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking successful', booking: newBooking });

  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
};

// Get booked seats for a specific assignment and date
const getBookedSeats = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { date } = req.query;

    if (!assignmentId || !date) {
      return res.status(400).json({ message: 'Assignment ID and date are required' });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const bookings = await Booking.find({
      assignmentId,
      bookingDate: {
        $gte: selectedDate,
        $lt: nextDate,
      },
      status: 'Confirmed',
    });

    const allSeats = bookings.flatMap(booking => booking.seatNumbers);
    res.status(200).json({ bookedSeats: allSeats });

  } catch (err) {
    console.error('Error fetching booked seats:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get bookings for a specific customer
const getBookingsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const bookings = await Booking.find({ customerId })
      .populate('busId')
      .populate({
        path: 'assignmentId',
        populate: { path: 'routeId' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customer bookings', error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate({
      path: 'assignmentId',
      populate: { path: 'routeId' }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const assignment = booking.assignmentId;
    const departureTime = assignment.forwardDepartureTime;

    if (!departureTime) {
      console.error('Missing forwardDepartureTime in assignment');
      return res.status(500).json({ message: 'Missing departure time.' });
    }

    const [hours, minutes] = departureTime.split(':');
    const departureDateTime = new Date(booking.bookingDate);
    departureDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const now = new Date();
    const timeDiff = departureDateTime.getTime() - now.getTime();

    if (timeDiff < 24 * 60 * 60 * 1000) {
      return res.status(403).json({ message: 'You can only cancel at least 24 hours before departure.' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully.' });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
  }
};


module.exports = {
  createBooking,
  getBookedSeats,
  getBookingsByCustomer,
  cancelBooking
};
