import React, { useEffect, useState } from 'react';
import SideBarBus from '../BUSComponent/SideBarBus';
import TopHeader from '../HRComponents/TopHeader';
import './BusSummary.css';
import axios from 'axios';
import { generateBusSummary } from '../utils/generateBusSummary';

const BusSummary = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/assignments/assigned')
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error('Failed to fetch bus summary:', err));
  }, []);

 const filteredAssignments = assignments.filter((a) => {
  const search = searchQuery.toLowerCase();
  return (
    a.busId?.busNumber?.toLowerCase().includes(search) ||
    a.routeId?.mainTown?.toLowerCase().includes(search) ||
    a.routeId?.secondaryTown?.toLowerCase().includes(search)
  );
});


  return (
    <div>
      <TopHeader />
      <div className="main-container d-flex">
        <SideBarBus />

        <div className="flex-grow-1 p-4">
          {/* 🔍 Search + Download */}
          <div className="d-flex justify-content-end align-items-center  flex-wrap mb-4">
            <div className="input-group bus-summary-search" style={{ maxWidth: '260px' }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="fas fa-search text-dark"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search Bus"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="btn btn-dark bus-summary-download-btn px-4" onClick={() => generateBusSummary(assignments)}>
              <i className="fas fa-download me-2"></i> Download PDF
            </button>
          </div>

          {/* 🚌 Scrollable Cards */}
          <div className="bus-summary-scrollable-body">
            <div className="bus-summary-flex-container">
              {filteredAssignments.map((a, index) => {
                const { busId, routeId, forwardDepartureTime, forwardArrivalTime, returnDepartureTime, returnArrivalTime } = a;

                const date = a.scheduleType === 'Specific Date' && a.date
                  ? new Date(a.date).toLocaleDateString()
                  : 'Every Day';

                return (
                  <div
                    className="bus-summary-fixed-card card shadow-sm"
                    key={index}
                    onClick={() => {
                      setSelectedAssignment(a);
                      setShowModal(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={
                        busId.image?.startsWith('http')
                          ? busId.image
                          : `http://localhost:5000/uploads/${busId.image}`
                      }
                      className="card-img-top bus-summary-image"
                      alt="Bus"
                    />
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <h6 className="mb-1 text-muted">Departure</h6>
                          <div className="fw-bold">{routeId.mainTown}</div>
                          <div className="small text-muted">{date} | {forwardDepartureTime}</div>
                        </div>
                        <div className="text-end">
                          <h6 className="mb-1 text-muted">Arrival</h6>
                          <div className="fw-bold">{routeId.secondaryTown}</div>
                          <div className="small text-muted">{date} | {forwardArrivalTime}</div>
                        </div>
                      </div>
                      <div className="mb-1">
                        <strong>Return:</strong> {returnDepartureTime} → {returnArrivalTime}
                      </div>
                      <div className="mb-1">
                        <strong>Ticket Price:</strong> Rs. {routeId.ticketPrice}/=
                      </div>
                      <div>
                        <strong>Bus Number:</strong> {busId.busNumber}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {showModal && selectedAssignment && (
  <>
    <div className="modal-backdrop-custom"></div> {/* ✅ BACKDROP ANIMATION */}

    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document" style={{ marginTop: '200px' }}>
        <div className="modal-content"> {/* ✅ MODAL ANIMATION */}
          <div className="modal-header">
            <h5 className="modal-title">Bus Route Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-5 text-center">
                <img
                  src={
                    selectedAssignment.busId?.image?.startsWith('http')
                      ? selectedAssignment.busId.image
                      : `http://localhost:5000/uploads/${selectedAssignment.busId.image}`
                  }
                  alt="Bus"
                  className="img-fluid rounded shadow-sm"
                />
              </div>
              <div className="col-md-7">
                <p><strong>Bus Type:</strong> {selectedAssignment.busId?.type}</p>
                <p><strong>Route Type:</strong> {selectedAssignment.routeId?.routeType}</p>
                <p><strong>Driver:</strong> {selectedAssignment.busId?.assignedDriver?.name || 'Not assigned'}</p>
                <p><strong>Conductor:</strong> {selectedAssignment.busId?.assignedConductor?.name || 'Not assigned'}</p>
                <p><strong>Garage:</strong> {selectedAssignment.busId?.assignedGarage?.name || 'Not assigned'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)}


    </div>
  );
};

export default BusSummary;
