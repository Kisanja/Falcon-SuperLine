import React from 'react';
import CustomerHeader from './CustomerHeader';
import { motion } from 'framer-motion';
import './Support.css';

const steps = [
  {
    title: '1. Browse Available Buses',
    description: 'On the home page, select your desired route and date. The system will show all available buses.',
  },
  {
    title: '2. Select a Bus',
    description: 'View details like bus type, departure time, and ticket price. Click on your preferred option.',
  },
  {
    title: '3. Choose Your Seat',
    description: 'You will be shown the seat layout. Select your preferred seats and click "Proceed to Payment".',
  },
  {
    title: '4. Complete Payment',
    description: 'Enter card details and confirm your payment. A booking confirmation will be shown.',
  },
  {
    title: '5. View Bookings',
    description: 'Go to "My Bookings" to see all your upcoming trips and manage cancellations.',
  }
];

const Support = () => {
  return (
    <div className="support-container">
      <CustomerHeader />
      <br/>
      <div className="container py-5">
        <motion.h2
          className="text-center fw-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          How to Book a Seat
        </motion.h2>

        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="support-step mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <h5 className="fw-bold text-info">{step.title}</h5>
            <p>{step.description}</p>
          </motion.div>
        ))}

        <hr className="my-5" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h4 className="fw-bold text-center mb-3">Frequently Asked Questions</h4>
          <ul className="support-faq">
            <li><strong>Can I cancel a booking?</strong> — Yes, if done at least 24 hours before departure.</li>
            <li><strong>What if my payment fails?</strong> — Your seat will not be reserved. Try again with valid card details.</li>
            <li><strong>How can I view past bookings?</strong> — Go to "My Profile" → Scroll to "My History".</li>
            <li><strong>Do I need to bring a printed ticket?</strong> — No. Just show your booking confirmation on mobile.</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
