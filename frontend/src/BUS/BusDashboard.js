import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBarBus from '../BUSComponent/SideBarBus';
import TopHeader from '../HRComponents/TopHeader';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BusDashboard.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


const BusRouteDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); // Format: YYYY-MM
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  

  useEffect(() => {
    axios.get('http://localhost:5000/api/buses')
      .then(res => setBuses(res.data))
      .catch(err => console.error('Failed to fetch buses:', err));

    axios.get('http://localhost:5000/api/routes')
      .then(res => setRoutes(res.data))
      .catch(err => console.error('Failed to fetch routes:', err));
  }, []);

  const busStats = [
    { label: 'Normal Bus', count: buses.filter(bus => bus.type === 'Normal').length },
    { label: 'A/C Bus', count: buses.filter(bus => bus.type === 'A/C').length },
    { label: 'Luxury Bus', count: buses.filter(bus => bus.type === 'Luxury').length },
    { label: 'Semi Luxury Bus', count: buses.filter(bus => bus.type === 'Semi luxury').length }
  ];

  const routeStats = [
    { label: 'Short Routes', count: routes.filter(route => route.routeType === 'Short Distance').length },
    { label: 'Long Routes', count: routes.filter(route => route.routeType === 'Long Distance').length },
    { label: 'Highway Routes', count: routes.filter(route => route.routeType === 'Highway Express').length }
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const filteredBuses = buses
  .filter(bus => {
    const matchesSearch =
      bus.busNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.type?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMonth = selectedMonth
      ? new Date(bus.insuranceExpiry).toISOString().slice(0, 7) === selectedMonth
      : true;

    return matchesSearch && matchesMonth;
  })
  .sort((a, b) => new Date(a.insuranceExpiry) - new Date(b.insuranceExpiry));

const isExpiringThisMonth = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return (
    expiry.getMonth() === today.getMonth() &&
    expiry.getFullYear() === today.getFullYear()
  );
};

const handleEditClick = (bus) => {
  setSelectedBus(bus);
  setShowConfirm(true);
};

const confirmUpdate = () => {
  setShowConfirm(false);
  setShowUpdateForm(true);
  setNewExpiryDate(selectedBus.insuranceExpiry?.slice(0, 10)); // ISO format YYYY-MM-DD
};

const handleUpdateSubmit = () => {
  axios.put(`http://localhost:5000/api/buses/${selectedBus._id}`, {
    insuranceExpiry: newExpiryDate
  })
  .then(() => {
    // Refresh data
    axios.get('http://localhost:5000/api/buses')
      .then(res => setBuses(res.data));

    setShowUpdateForm(false);
    setSelectedBus(null);
    setNewExpiryDate('');
  })
  .catch(err => console.error("Failed to update:", err));
};

const handleDeletePopup = (bus) => {
  setSelectedBus(bus);
  setShowDeletePopup(true);
};

const closeDeletePopup = () => {
  setSelectedBus(null);
  setShowDeletePopup(false);
};

  return (
    <div>
      <TopHeader />
      <div className="main-container d-flex">
        <SideBarBus />
        <div className="flex-grow-1 p-4">
          <div className="container">

            {/* 🔷 Bus Type Summary */}
            <h5 className="mb-3 fw-bold">Total Buses</h5>
            <div className="row g-3 mb-4">
              {busStats.map((bus, index) => (
                <div className="col-6 col-md-3" key={index}>
                  <div className="border border-primary rounded text-center py-4 h-100">
                    <h5 className="text-primary fw-bold">{bus.count}</h5>
                    <small className="d-block mt-2">{bus.label}</small>
                  </div>
                </div>
              ))}
            </div>

            {/* 🛣️ Route Type Summary */}
            <h5 className="mb-3 fw-bold">Total Routes</h5>
            <div className="row g-3 mb-4">
              {routeStats.map((route, index) => (
                <div className="col-6 col-md-4" key={index}>
                  <div className="border border-success rounded text-center py-4 h-100">
                    <h5 className="text-success fw-bold">{route.count}</h5>
                    <small className="d-block mt-2">{route.label}</small>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔴 Insurance Expiration Header */}
            <h5 className="mb-3 fw-bold text-danger">Insurance Expiration</h5>

            {/* 🔍 Search + 📅 Month Filter */}
            <div className="d-flex justify-content-end align-items-center gap-3 mb-3">
              <div className="input-group custom-input-group w-auto">
                <span className="input-group-text bg-white border-blue text-primary">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-blue"
                  placeholder="Search bus"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
            </div>
              <input
                type="month"
                className="form-control w-auto border-blue"
                value={selectedMonth}
                onChange={handleMonthChange}
              />
            </div>

            {/* 📋 Table with sticky header and scrollable body */}
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Bus Number</th>
                    <th>Type</th>
                    <th>Insurance Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
              </table>
              <div className="custom-scroll-body">
                <table className="custom-table">
                  <tbody>
                    {filteredBuses.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="no-data">No buses found for selected filters.</td>
                      </tr>
                    ) : (
                      filteredBuses.map((bus, index) => (
                        <tr
                          key={index}
                          className={isExpiringThisMonth(bus.insuranceExpiry) ? 'row-expiring' : ''}
                        >
                          <td>{bus.busNumber}</td>
                          <td>{bus.type}</td>
                          <td className={isExpiringThisMonth(bus.insuranceExpiry) ? 'text-danger fw-bold' : ''}>
                            {new Date(bus.insuranceExpiry).toLocaleDateString()}
                          </td>
                          <td>
                            <button className="action-btn1 edit-btn1" title="Edit" onClick={() => handleEditClick(bus)}>
                              <FaEdit />
                            </button>
                            <button
                              className="action-btn1 delete-btn1"
                              title="Delete"
                              onClick={() => handleDeletePopup(bus)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* 🔒 Confirm Update Modal */}
        <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to update this bus's insurance expiry date?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button variant="dark" onClick={confirmUpdate}>Yes, Update</Button>
          </Modal.Footer>
        </Modal>

        {/* Update Date Modal */}
      <Modal show={showUpdateForm} onHide={() => setShowUpdateForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Expiry Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="date"
            className="form-control"
            value={newExpiryDate}
            onChange={(e) => setNewExpiryDate(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateForm(false)}>Cancel</Button>
          <Button variant="dark" onClick={handleUpdateSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {showDeletePopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h6 className="text-danger fw-bold mb-3">Notice</h6>
            <p>
              In here you can't remove the bus. Please visit <strong>Add Bus</strong> page if you want to delete the bus.
            </p>
            <div className="text-end mt-4">
              <button className="btn btn-dark" onClick={closeDeletePopup}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BusRouteDashboard;
