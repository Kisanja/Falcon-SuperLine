import React, { useEffect, useState } from 'react';
import CustomerHeader from './CustomerHeader';
import './MyBooking.css';
import { motion } from 'framer-motion';
import { FaBusAlt } from 'react-icons/fa';
import axios from 'axios';

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const customer = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!customer?._id) return;

    axios.get(`http://localhost:5000/api/bookings/customer/${customer._id}`)
      .then((res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureBookings = res.data.filter((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate >= today;
        });

        setBookings(futureBookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch bookings:', err);
        setLoading(false);
      });
  }, [customer]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.put(`http://localhost:5000/api/bookings/cancel/${bookingId}`);
      const updated = bookings.map((b) =>
        b._id === bookingId ? { ...b, status: 'Cancelled' } : b
      );
      setBookings(updated);
      setPopup({ type: 'success', message: '✅ Booking cancelled successfully!' });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || '❌ Failed to cancel booking.';
      setPopup({ type: 'error', message: msg });
    } finally {
      setTimeout(() => setPopup(null), 2500);
    }
  };

  const isWithin24Hours = (booking) => {
    const departureTime = booking.assignmentId?.forwardDepartureTime;
    if (!departureTime) return true;

    const [h, m] = departureTime.split(':');
    const date = new Date(booking.bookingDate);
    date.setHours(parseInt(h), parseInt(m), 0, 0);

    const now = new Date();
    return date.getTime() - now.getTime() < 24 * 60 * 60 * 1000;
  };

  return (
    <div className="mybooking-container">
      <CustomerHeader />

      <div className="mybooking-content container py-5">
        <motion.h2
          className="mb-4 fw-bold text-dark"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My Bookings
        </motion.h2>

        {loading ? (
          <div className="text-center text-muted">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-muted">You have no upcoming bookings.</div>
        ) : (
          <div className="mybooking-table-wrapper">
            <table className="mybooking-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Bus Number</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Time</th>
                  <th>Seat numbers</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    className="mybooking-row"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>
                      {booking.busId?.image ? (
                        <img
                          src={
                            booking.busId.image.startsWith('http')
                              ? booking.busId.image
                              : `http://localhost:5000/uploads/${booking.busId.image}`
                          }
                          alt="bus"
                          className="mybooking-avatar"
                          onError={(e) => {
                            e.target.src = '/fallback.png';
                          }}
                        />
                      ) : (
                        <FaBusAlt className="mybooking-avatar" />
                      )}
                    </td>
                    <td>{booking.busId?.busNumber || '-'}</td>
                    <td>{booking.busId?.type || '-'}</td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td>{booking.assignmentId?.routeId?.mainTown || '-'}</td>
                    <td>{booking.assignmentId?.routeId?.secondaryTown || '-'}</td>
                    <td>{booking.assignmentId?.forwardDepartureTime || '-'}</td>
                    <td>{booking.seatNumbers.join(', ')}</td>
                    <td>
                      <span
                        className={`badge ${
                          booking.status === 'Cancelled'
                            ? 'text-bg-danger'
                            : 'text-bg-success'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          if (booking.status === 'Cancelled') return;
                          if (isWithin24Hours(booking)) {
                            setPopup({ type: 'error', message: '⏰ You can only cancel bookings at least 24 hours before departure time.' });
                            setTimeout(() => setPopup(null), 3000);
                          } else {
                            handleCancel(booking._id);
                          }
                        }}
                        disabled={booking.status === 'Cancelled'}
                      >
                        Cancel
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {popup && (
        <div className={`popup-msg ${popup.type}`}>{popup.message}</div>
      )}
    </div>
  );
};

export default MyBooking;
