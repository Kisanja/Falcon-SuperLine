import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DisplayBus.css';

const DisplayBus = () => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/assignments/assigned')
      .then((res) => setBuses(res.data))
      .catch((err) => console.error('Failed to fetch buses:', err));
  }, []);

  const now = new Date();
  const selectedDateObj = date ? new Date(date) : new Date();

  const isFutureDate = (d) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(d).setHours(0, 0, 0, 0) > today.getTime();
  };

  const filterTrips = (isReturnTrip) => {
    return buses.filter((bus) => {
      const main = bus.routeId?.mainTown?.toLowerCase();
      const secondary = bus.routeId?.secondaryTown?.toLowerCase();
      const assignedDate = bus.scheduleType === 'Specific Date' && bus.date
        ? new Date(bus.date).toDateString()
        : 'Every Day';

      const matchDeparture = isReturnTrip ? secondary : main;
      const matchArrival = isReturnTrip ? main : secondary;

      const cityMatch = (!departure || matchDeparture === departure.toLowerCase()) &&
                        (!arrival || matchArrival === arrival.toLowerCase());

      let timeMatch = true;
      if (!date) {
        if (bus.scheduleType !== 'Every Day') return false;

        const departureTimeStr = isReturnTrip ? bus.returnDepartureTime : bus.forwardDepartureTime;
        const [hours, minutes] = departureTimeStr.split(':').map(Number);
        const departureTime = new Date();
        departureTime.setHours(hours, minutes, 0, 0);

        const timeDiff = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60); // in hours
        timeMatch = timeDiff >= 2;
      } else {
        const selectedStr = selectedDateObj.toDateString();
        timeMatch = bus.scheduleType === 'Every Day' || assignedDate === selectedStr;
      }

      return cityMatch && timeMatch;
    });
  };

  const navigate = useNavigate();

  const renderCard = (bus, type, index) => {
    const isForward = type === 'forward';
    const time = isForward ? bus.forwardDepartureTime : bus.returnDepartureTime;
    const dateToShow = date
      ? new Date(date).toLocaleDateString()
      : bus.scheduleType === 'Specific Date' && bus.date
      ? new Date(bus.date).toLocaleDateString()
      : new Date().toLocaleDateString();

    return (
      <div className="col-md-3 col-sm-6" key={`${index}-${type}`}>
        <div className="bus-card shadow-sm">
          <img
            src={bus.busId.image?.startsWith('http')
              ? bus.busId.image
              : `http://localhost:5000/uploads/${bus.busId.image}`}
            alt="Bus"
            className="img-fluid bus-image rounded-top"
          />
          <div className="p-3">
            <div className="d-flex justify-content-between small fw-semibold mb-2 text-light-subtle">
              <div>
                <span className="text-secondary">Departure</span>
                <div className="text-info">{isForward ? bus.routeId.mainTown : bus.routeId.secondaryTown}</div>
                <div>{isForward ? bus.forwardDepartureTime : bus.returnDepartureTime}</div>
              </div>
              <div>
                <span className="text-secondary">Arrival</span>
                <div className="text-info">{isForward ? bus.routeId.secondaryTown : bus.routeId.mainTown}</div>
                <div>{isForward ? bus.forwardArrivalTime : bus.returnArrivalTime}</div>
              </div>
            </div>
            <p className="mb-1 text-light-subtle">
              <strong>Date:</strong> <span className="text-primary">{dateToShow}</span>
            </p>
            <p className="mb-3 text-light-subtle">
              <strong>Available Seats:</strong> <span className="text-success">{bus.busId?.seatCapacity || 0}</span>
            </p>
            <button
  className="btn btn-primary w-100"
  onClick={() => navigate(`/book-seat/${bus._id}`)}
>
  Book Seat
</button>

          </div>
        </div>
      </div>
    );
  };

  const forwardTrips = filterTrips(false);
  const returnTrips = filterTrips(true);

  return (
    <div className="container display-bus-container py-5">
      <CustomerHeader />
      <div className="container py-5">
        <motion.div
          className="row g-3 justify-content-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Departure City */}
          <div className="col-md-3 col-sm-6 text-center">
            <label className="form-label fw-bold">Departure City</label>
            <motion.select
              className="form-select shadow-sm"
              whileHover={{ scale: 1.03 }}
              onChange={(e) => setDeparture(e.target.value)}
              value={departure}
            >
              <option value="">Select</option>
              <option value="Colombo">Colombo</option>
              <option value="Badulla">Badulla</option>
              <option value="Matara">Matara</option>
              <option value="Kurunegala">Kurunegala</option>
              <option value="Kandy">Kandy</option>
              <option value="Moratuwa">Moratuwa</option>
              <option value="Kollupitiya">Kollupitiya</option>
            </motion.select>
          </div>

          {/* Arrival City */}
          <div className="col-md-3 col-sm-6 text-center">
            <label className="form-label fw-bold">Arrival City</label>
            <motion.select
              className="form-select shadow-sm"
              whileHover={{ scale: 1.03 }}
              onChange={(e) => setArrival(e.target.value)}
              value={arrival}
            >
              <option value="">Select</option>
              <option value="Colombo">Colombo</option>
              <option value="Badulla">Badulla</option>
              <option value="Matara">Matara</option>
              <option value="Kurunegala">Kurunegala</option>
              <option value="Kandy">Kandy</option>
              <option value="Moratuwa">Moratuwa</option>
              <option value="Kollupitiya">Kollupitiya</option>
            </motion.select>
          </div>

          {/* Select Date */}
          <div className="col-md-3 col-sm-6 text-center">
            <label className="form-label fw-bold">Select Date</label>
            <motion.div whileHover={{ scale: 1.03 }}>
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-light">
                  <FaCalendarAlt />
                </span>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="container my-5">
        <h4 className="mb-4">Available Buses</h4>
        <div className="row g-4">
          {forwardTrips.length === 0 && returnTrips.length === 0 ? (
            <div className="text-center text-muted py-5">
              <h5>No buses available for the selected criteria.</h5>
            </div>
          ) : (
            [
              ...forwardTrips.map((bus, i) => renderCard(bus, 'forward', i)),
              ...returnTrips.map((bus, i) => renderCard(bus, 'return', i)),
            ]
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayBus;
