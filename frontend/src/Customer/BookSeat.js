import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import axios from 'axios';
import { motion } from 'framer-motion';
import BusImage from '../assets/bus-icon.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SeatSelection.css';

const BookSeat = () => {
  const { id } = useParams();
  const [busData, setBusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  // Fetch assignment (bus route data)
  useEffect(() => {
    axios.get('http://localhost:5000/api/assignments/assigned')
      .then((res) => {
        const match = res.data.find((assignment) => assignment._id === id);
        setBusData(match || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching bus data:', err);
        setLoading(false);
      });
  }, [id]);

  const navigate = useNavigate();

  // Fetch booked seats (with correct bookingDate based on schedule type)
 useEffect(() => {
  if (!id || !busData) return;

  const queryDate =
    busData.scheduleType === 'Specific Date'
      ? new Date(busData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

  axios
    .get(`http://localhost:5000/api/bookings/booked/${id}?date=${queryDate}`)
    .then((res) => {
      setBookedSeats(res.data.bookedSeats || []);
    })
    .catch((err) => console.error('Error fetching booked seats:', err));
}, [id, busData]);


  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber) || seatNumber <= 5) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const getSeatClass = (seatNumber) => {
    if (seatNumber <= 5) return 'seat counter';
    if (bookedSeats.includes(seatNumber)) return 'seat booked';
    if (selectedSeats.includes(seatNumber)) return 'seat processing';
    return 'seat available';
  };

  const renderSeatLayout = () => {
    const seatCount = busData.busId.seatCapacity;
    const seats = [];
    let seatNum = 1;

    if (seatCount === 54) {
      for (let i = 0; i < 9; i++) {
        const left = Array.from({ length: 2 }).map(() => {
          const current = seatNum++;
          return current <= seatCount && (
            <div key={current} className={getSeatClass(current)} onClick={() => handleSeatClick(current)}>{current}</div>
          );
        });
        const right = Array.from({ length: 3 }).map(() => {
          const current = seatNum++;
          return current <= seatCount && (
            <div key={current} className={getSeatClass(current)} onClick={() => handleSeatClick(current)}>{current}</div>
          );
        });
        seats.push(<div className="seat-row" key={`row-${i}`}>{left}<div className="seat-gap"></div>{right}</div>);
      }
      const last3 = Array.from({ length: 3 }).map(() => {
        const current = seatNum++;
        return current <= seatCount && (
          <div key={current} className={getSeatClass(current)} onClick={() => handleSeatClick(current)}>{current}</div>
        );
      });
      const last6 = Array.from({ length: 6 }).map(() => {
        const current = seatNum++;
        return current <= seatCount && (
          <div key={current} className={getSeatClass(current)} onClick={() => handleSeatClick(current)}>{current}</div>
        );
      });
      seats.push(<div className="seat-row" key="row-last-3">{last3}</div>);
      seats.push(<div className="seat-row" key="row-last-6">{last6}</div>);
    } else {
      const rowPairs = seatCount === 44 ? 9 : seatCount === 49 ? 11 : 7;
      for (let i = 0; i < rowPairs; i++) {
        const left = Array.from({ length: 2 }).map(() => {
          const current = seatNum++;
          return current <= seatCount && (
            <div key={current} className={getSeatClass(current)} onClick={() => handleSeatClick(current)}>{current}</div>
          );
        });
        const right = Array.from({ length: 2 }).map(() => {
          const current = seatNum++;
          return current <= seatCount && (
            <div key={current} className={getSeatClass(current)} onClick={() => handleSeatClick(current)}>{current}</div>
          );
        });
        seats.push(<div className="seat-row" key={`row-${i}`}>{left}<div className="seat-gap"></div>{right}</div>);
      }
      const lastSeats = seatCount === 44 ? 6 : 5;
      const lastRow = Array.from({ length: lastSeats }).map(() => {
        const current = seatNum++;
        return current <= seatCount && (
          <div key={current} className={getSeatClass(current)} onClick={() => handleSeatClick(current)}>{current}</div>
        );
      });
      seats.push(<div className="seat-row" key="final-row">{lastRow}</div>);
    }
    return seats;
  };

  if (loading) return <div className="white-bg full-height"><CustomerHeader /><div className="container text-center my-5 py-5 text-muted">Loading bus details...</div></div>;
  if (!busData) return <div className="white-bg full-height"><CustomerHeader /><div className="container text-center my-5 py-5 text-danger">Bus not found or data missing.</div></div>;

  const handleBookingRedirect = () => {
  const customer = JSON.parse(localStorage.getItem('user'));
  const payload = {
    customerId: customer?._id,
    assignmentId: id,
    seatNumbers: selectedSeats,
    totalPrice: selectedSeats.length * (routeId.ticketPrice || 0),
    scheduleType,
    bookingDate: scheduleType === 'Specific Date'
      ? new Date(date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    busId: busId._id,
    busNumber: busId.busNumber,
    route: {
      mainTown: routeId.mainTown,
      secondaryTown: routeId.secondaryTown,
      ticketPrice: routeId.ticketPrice
    }
  };

  navigate('/payment', { state: payload });
};

  const { busId, routeId, forwardDepartureTime, forwardArrivalTime, scheduleType, date } = busData;

  return (
    <div className="white-bg full-height">
      <CustomerHeader />
      <div className="container my-5 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="d-flex rounded p-3 align-items-center shadow-sm text-white"
          style={{ backgroundColor: '#1c1c2c', maxWidth: '960px', margin: 'auto' }}
        >
          <img src={busId.image?.startsWith('http') ? busId.image : `http://localhost:5000/uploads/${busId.image}`} alt="Bus" className="rounded me-3" style={{ width: '130px', height: '100px', objectFit: 'cover' }} onError={(e) => { e.target.src = BusImage }} />
          <div className="me-auto">
            <div className="fw-semibold">{busId.busNumber}</div>
            <div>{scheduleType === 'Specific Date' ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString()}</div>
            <div>{busId.seatCapacity} Seats - {busId.type}</div>
          </div>
          <div className="text-center mx-4">
            <div className="fw-semibold">Departure</div>
            <div>{routeId.mainTown}</div>
            <div>{forwardDepartureTime}</div>
          </div>
          <div className="fs-5 mx-2">➡️</div>
          <div className="text-center mx-4">
            <div className="fw-semibold">Arrival</div>
            <div>{routeId.secondaryTown}</div>
            <div>{forwardArrivalTime}</div>
          </div>
          <div className="fw-semibold fs-6 ms-auto text-info">Rs. {routeId.ticketPrice ?? '0'}</div>
        </motion.div>

        <div className="d-flex mt-5 gap-5 justify-content-center flex-wrap">
          <div className="seat-legend">
            <div><span className="seat available" /> Available</div>
            <div><span className="seat processing" /> Processing</div>
            <div><span className="seat counter" /> Counter</div>
            <div><span className="seat booked" /> Booked</div>
          </div>
          <div className="seat-container">{renderSeatLayout()}</div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-primary" disabled={selectedSeats.length === 0} onClick={handleBookingRedirect}>
  Proceed to Payment ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''})
</button>

        </div>
      </div>
    </div>
  );
};

export default BookSeat;
