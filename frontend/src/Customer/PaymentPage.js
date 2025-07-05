import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerHeader from './CustomerHeader';
import { motion } from 'framer-motion';
import './PaymentPage.css';
import { generateTicketPDF } from '../utils/generateTicketPDF';

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    agree: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState(null);

  if (!state) return <div className="container py-5 text-danger">No booking info found.</div>;

  const {
    customerId, assignmentId, seatNumbers, totalPrice, bookingDate, busId, busNumber, route, forwardDepartureTime
  } = state;

  const validate = () => {
    const errs = {};
    if (!form.cardName.trim()) errs.cardName = 'Cardholder name is required';
    if (!/^[0-9]{16}$/.test(form.cardNumber)) errs.cardNumber = 'Card number must be 16 digits';
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(form.expiry)) errs.expiry = 'Expiry must be in MM/YY format';
    if (!/^[0-9]{3}$/.test(form.cvv)) errs.cvv = 'CVV must be 3 digits';
    if (!form.agree) errs.agree = 'You must agree to terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinalPayment = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        customerId,
        assignmentId,
        seatNumbers,
        totalPrice,
        bookingDate
      });

      generateTicketPDF({
  customerName: customer?.name || 'Customer',
  busNumber,
  route,
  seatNumbers,
  bookingId: assignmentId, // Use assignmentId for ticketId
  date: bookingDate, // ✅ Ensure this is passed as 'date'
  departureTime: route?.forwardDepartureTime || 'N/A' // ✅ Use this directly
});



      setPopup({ type: 'success', message: '✅ Payment successful & booking confirmed!' });
      setTimeout(() => navigate('/customer/my-bookings'), 1800);
    } catch (err) {
      console.error(err);
      setPopup({ type: 'error', message: '❌ Booking failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="full-height" style={{ backgroundColor: '#ffffff', color: '#1c1c2c' }}>
      <CustomerHeader /> <br />
      <div className="container py-5" style={{ maxWidth: '700px' }}>
        <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">Payment Summary</motion.h3>

        <motion.div className="card p-4 shadow-sm mb-4" style={{ backgroundColor: '#2a2a3b', color: '#fff' }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <p><strong>Bus Number:</strong> {busNumber}</p>
          <p><strong>Route:</strong> {route.mainTown} ➡️ {route.secondaryTown}</p>
          <p><strong>Seats Selected:</strong> {seatNumbers.join(', ')}</p>
          <p><strong>Ticket Price:</strong> Rs. {route.ticketPrice}</p>
          <p><strong>Total:</strong> Rs. {totalPrice}</p>
        </motion.div>

        <motion.div className="card p-4 shadow-sm payment-form" style={{ backgroundColor: '#2a2a3b', color: '#fff' }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h5 className="mb-3">Card Information</h5>
          <div className="mb-3">
            <label className="form-label">Name on Card</label>
            <input type="text" name="cardName" className={`form-control ${errors.cardName ? 'is-invalid' : ''}`} value={form.cardName} onChange={handleChange} />
            {errors.cardName && <div className="invalid-feedback">{errors.cardName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Card Number</label>
            <input type="text" name="cardNumber" maxLength={16} className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`} value={form.cardNumber} onChange={handleChange} />
            {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Expiry (MM/YY)</label>
              <input type="text" name="expiry" className={`form-control ${errors.expiry ? 'is-invalid' : ''}`} value={form.expiry} onChange={handleChange} />
              {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">CVV</label>
              <input type="password" name="cvv" maxLength={3} className={`form-control ${errors.cvv ? 'is-invalid' : ''}`} value={form.cvv} onChange={handleChange} />
              {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
            </div>
          </div>

          <div className="form-check mb-3">
            <input className={`form-check-input ${errors.agree ? 'is-invalid' : ''}`} type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            <label className="form-check-label">
              I agree to the <a href="#" style={{ color: '#90caf9' }}>terms and conditions</a>.
            </label>
            {errors.agree && <div className="invalid-feedback d-block">{errors.agree}</div>}
          </div>

          <button className="btn w-100" style={{ backgroundColor: '#007bff', color: '#fff' }} disabled={submitting} onClick={handleFinalPayment}>
            {submitting ? 'Processing...' : `Pay Rs. ${totalPrice}`}
          </button>
        </motion.div>

        {popup && (
          <div className={`payment-popup-box ${popup.type}`}>{popup.message}</div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
