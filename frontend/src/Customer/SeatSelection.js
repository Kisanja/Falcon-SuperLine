// SeatSelection.js
import React, { useState, useEffect } from 'react';
import './SeatSelection.css';

const SeatSelection = ({ seatCapacity = 54, bookedSeats = [] }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatNum) => {
    if (bookedSeats.includes(seatNum) || seatNum <= 5) return; // skip booked or counter seats
    setSelectedSeats((prev) =>
      prev.includes(seatNum)
        ? prev.filter((s) => s !== seatNum)
        : [...prev, seatNum]
    );
  };

  const getSeatClass = (seatNum) => {
    if (bookedSeats.includes(seatNum)) return 'seat booked';
    if (seatNum <= 5) return 'seat counter';
    if (selectedSeats.includes(seatNum)) return 'seat selected';
    return 'seat available';
  };

  const generateSeats = () => {
    let layout = [];
    let total = seatCapacity;
    let seatNum = 1;

    // Seat logic per layout type
    if (total === 54) {
      for (let i = 0; i < 9; i++) layout.push([seatNum++, seatNum++, seatNum++, '', seatNum++, seatNum++]);
      layout.push([seatNum++, seatNum++, seatNum++, '']);
      layout.push([seatNum++, seatNum++, seatNum++, seatNum++, seatNum++, seatNum++]);
    } else if (total === 49) {
      for (let i = 0; i < 11; i++) layout.push([seatNum++, seatNum++, '', seatNum++, seatNum++]);
      layout.push([seatNum++, seatNum++, seatNum++, seatNum++, seatNum++]);
    } else if (total === 44) {
      for (let i = 0; i < 9; i++) layout.push([seatNum++, seatNum++, '', seatNum++, seatNum++]);
      layout.push([seatNum++, seatNum++]);
      layout.push([seatNum++, seatNum++, seatNum++, seatNum++, seatNum++, seatNum++]);
    } else if (total === 33) {
      for (let i = 0; i < 7; i++) layout.push([seatNum++, seatNum++, '', seatNum++, seatNum++]);
      layout.push([seatNum++, seatNum++, seatNum++, seatNum++, seatNum++]);
    }
    return layout;
  };

  return (
    <div className="seat-layout">
      <div className="legend">
        <span className="seat available"></span> Available
        <span className="seat selected"></span> Processing
        <span className="seat counter"></span> Counter
        <span className="seat booked"></span> Booked
      </div>
      {generateSeats().map((row, i) => (
        <div className="seat-row" key={i}>
          {row.map((seat, j) => (
            <span
              key={j}
              className={seat ? getSeatClass(seat) : 'spacer'}
              onClick={() => seat && toggleSeat(seat)}>
              {seat}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SeatSelection;
