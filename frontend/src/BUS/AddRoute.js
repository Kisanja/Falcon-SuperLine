import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBarBus from '../BUSComponent/SideBarBus';
import TopHeader from '../HRComponents/TopHeader';
import './AddRoute.css';
import { generateRoutesPDF } from '../utils/generateRoutesPDF';

const AddRoute = () => {
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [routeNumber, setRouteNumber] = useState('');
  const [permitNumber, setPermitNumber] = useState('');
  const [mainTown, setMainTown] = useState('');
  const [secondaryTown, setSecondaryTown] = useState('');
  const [routeType, setRouteType] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, success: true, message: '' });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/routes');
      setRoutes(res.data);
    } catch (err) {
      console.error('Error fetching routes:', err);
    }
  };

  const handleSubmit = async () => {
  if (!routeNumber || !permitNumber || !mainTown || !secondaryTown || !routeType || ticketPrice === '') {
    showDialogMessage('❌ Please fill all fields.', 'error');
    return;
  }

  if (errors.mainTown || errors.secondaryTown) {
    showDialogMessage('❌ Please fix input errors before submitting.', 'error');
    return;
  }

    if (isNaN(ticketPrice) || Number(ticketPrice) < 0) {
    showDialogMessage('❌ Ticket price must be a non-negative number.', 'error');
    return;
  }

  try {
    await axios.post('http://localhost:5000/api/routes', {
      routeNumber,
      permitNumber,
      mainTown,
      secondaryTown,
      routeType,
      ticketPrice: Number(ticketPrice),
    });

    showDialogMessage('✅ Route added successfully!', 'success');
    setShowModal(false);
    setRouteNumber('');
    setPermitNumber('');
    setMainTown('');
    setSecondaryTown('');
    setRouteType('');
    setTicketPrice('');
    fetchRoutes();
  } catch (error) {
    console.error('Error adding route:', error);
    showDialogMessage('❌ Failed to add route. Try again.', 'error');
  }
};

  const showDialogMessage = (message, type) => {
    setDialogMessage(message);
    setDialogType(type);
    setShowDialog(true);
    setTimeout(() => setShowDialog(false), 3000);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) {
      setFeedback({ show: true, success: false, message: 'Invalid route ID.' });
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/routes/${deleteId}`);
      setRoutes(prev => prev.filter(route => route._id !== deleteId));
      setFeedback({ show: true, success: true, message: 'Route deleted successfully!' });
    } catch (error) {
      console.error('Delete Error:', error.response || error.message);
      setFeedback({ show: true, success: false, message: 'Failed to delete route.' });
    }

    setShowConfirm(false);

    setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleUpdateClick = (route) => {
  setCurrentRoute(route);
  setShowUpdateModal(true);
};

const handleUpdateSubmit = async () => {
  try {
    await axios.put(`http://localhost:5000/api/routes/${currentRoute._id}`, currentRoute);
    showDialogMessage('✅ Route updated successfully!', 'success');
    setShowUpdateModal(false);
    fetchRoutes(); // Refresh list
  } catch (error) {
    console.error('Update Error:', error);
    showDialogMessage('❌ Failed to update route.', 'error');
  }
};

const filteredRoutes = routes.filter(route =>
  (selectedType === '' || route.routeType === selectedType) &&
  (
    route.routeNumber.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.permitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.mainTown.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.secondaryTown.toLowerCase().includes(searchQuery.toLowerCase())
  )
);

const handleDownloadPDF = () => {
  generateRoutesPDF(filteredRoutes);
};

const [errors, setErrors] = useState({
  mainTown: '',
  secondaryTown: ''
});

const lettersOnlyRegex = /^[A-Za-z\s]*$/;

const handleMainTownChange = (e) => {
  const value = e.target.value;
  if (!lettersOnlyRegex.test(value)) {
    setErrors(prev => ({ ...prev, mainTown: 'Enter English letters only' }));
  } else {
    setErrors(prev => ({ ...prev, mainTown: '' }));
  }
  setMainTown(value);
};

const handleSecondaryTownChange = (e) => {
  const value = e.target.value;
  if (!lettersOnlyRegex.test(value)) {
    setErrors(prev => ({ ...prev, secondaryTown: 'Enter English letters only' }));
  } else {
    setErrors(prev => ({ ...prev, secondaryTown: '' }));
  }
  setSecondaryTown(value);
};

 const routeIcons = {
  'Long Distance': '/icons/square-l.png',
  'Short Distance': '/icons/square-s.png',
  'Highway Express': '/icons/h-square.png',
};

  return (
    <div>
      <TopHeader />
      <div className="main-container d-flex">
        <SideBarBus />
        <div className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-2">
            <button className="btn btn-dark px-4" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus me-2"></i> Add Route
            </button>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <select
                className="form-select falcon-filter-select"
                style={{ width: '160px' }}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                >
                <option value="">Filter (All Types)</option>
                <option value="Short Distance">Short Distance</option>
                <option value="Long Distance">Long Distance</option>
                <option value="Highway Express">Highway Express</option>
              </select>

              <div className="input-group" style={{ width: '200px' }}>
                <span className="input-group-text bg-white border-end-0">
                  <i className="fas fa-search text-dark"></i>
                </span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Route"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

              </div>

              <button className="btn btn-dark px-4" onClick={handleDownloadPDF}>
                <i className="fas fa-download me-2"></i> Download PDF
            </button>

            </div>
          </div>

          <h5 className="fw-bold">Registered Routes</h5>

          <div className="falcon-routes-container">
            <div className="falcon-routes-header">
              <div>Icon</div>
              <div>Route Number</div>
              <div>Permit Number</div>
              <div>Main Town</div>
              <div>Second Town</div>
              <div>Type</div>
              <div>Ticket Price</div>
              <div>Action</div>
            </div>

            <div className="falcon-routes-body-scroll">
              {filteredRoutes.map((route) => (
                <div className="falcon-route-row" key={route._id}>
                  <img src={routeIcons[route.routeType] || '/icons/default.png'} alt='icon' className='income-icon-img' />
                  <div>{route.routeNumber}</div>
                  <div>{route.permitNumber}</div>
                  <div>{route.mainTown}</div>
                  <div>{route.secondaryTown}</div>
                  <div>{route.routeType}</div>
                  <div>{route.ticketPrice}</div>
                  <div>
                    <button className="falcon-edit-btn" onClick={() => handleUpdateClick(route)}>
                        <i className="fas fa-pen"></i>
                    </button>

                    <button className="falcon-delete-btn" onClick={() => handleDeleteClick(route._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="falcon-modal-backdrop">
          <div className="falcon-modal">
            <h4 className="modal-title">Add New Route</h4>
            <div className="modal-body">
              <label className="falcon-label">Enter Route Number</label>
              <input type="text" className="falcon-input" value={routeNumber} onChange={(e) => setRouteNumber(e.target.value)} placeholder="E.g. 101" />
              <label className="falcon-label">Enter Permit Number</label>
              <input type="text" className="falcon-input" value={permitNumber} onChange={(e) => setPermitNumber(e.target.value)} placeholder="E.g. P-123456" />
              <label className="falcon-label">Enter Main Town</label>
<input
  type="text"
  className="falcon-input"
  value={mainTown}
  onChange={handleMainTownChange}
  placeholder="E.g. Colombo"
/>
{errors.mainTown && <div className="text-danger">{errors.mainTown}</div>}

<label className="falcon-label">Enter Secondary Town</label>
<input
  type="text"
  className="falcon-input"
  value={secondaryTown}
  onChange={handleSecondaryTownChange}
  placeholder="E.g. Badulla"
/>
{errors.secondaryTown && <div className="text-danger">{errors.secondaryTown}</div>}

              <label className="falcon-label">Select Route Type</label>
              <select className="falcon-input" value={routeType} onChange={(e) => setRouteType(e.target.value)}>
                <option value="">Choose Type</option>
                <option value="Short Distance">Short Distance</option>
                <option value="Long Distance">Long Distance</option>
                <option value="Highway Express">Highway Express</option>
              </select>

                         <label className="falcon-label">Enter Ticket Price (Rs.)</label>
<input
  type="number"
  className="falcon-input"
  value={ticketPrice}
  onChange={(e) => setTicketPrice(e.target.value)}
  placeholder="E.g. 150"
/>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
        <div className="falcon-dialog-overlay">
          <div className="falcon-dialog-box error">
            <div className="dialog-header">
              Confirm Delete
              <span className="dialog-close" onClick={() => setShowConfirm(false)}>&times;</span>
            </div>
            <div className="dialog-body">
              Are you sure you want to delete this route?
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary me-2" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Info Dialog */}
      {showDialog && (
        <div className="falcon-dialog-overlay">
          <div className={`falcon-dialog-box ${dialogType}`}>
            <div className="dialog-header">
              <span className="dialog-title">{dialogType === 'success' ? 'Success' : 'Error'}</span>
              <span className="dialog-close" onClick={() => setShowDialog(false)}>&times;</span>
            </div>
            <div className="dialog-body">{dialogMessage}</div>
            <div className="dialog-footer">
              <button className="btn btn-dark px-4" onClick={() => setShowDialog(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Dialog */}
      {feedback.show && (
        <div className="falcon-dialog-overlay">
          <div className={`falcon-dialog-box ${feedback.success ? 'success' : 'error'}`}>
            <div className="dialog-header">
              {feedback.success ? 'Success' : 'Error'}
              <span className="dialog-close" onClick={() => setFeedback({ ...feedback, show: false })}>&times;</span>
            </div>
            <div className="dialog-body">
              {feedback.message}
            </div>
            <div className="dialog-footer">
              <button className="btn btn-dark" onClick={() => setFeedback({ ...feedback, show: false })}>OK</button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && currentRoute && (
  <div className="falcon-modal-backdrop">
    <div className="falcon-modal">
      <h4 className="modal-title">Update Route</h4>
      <div className="modal-body">
        <label className="falcon-label">Route Number</label>
        <input type="text" className="falcon-input" value={currentRoute.routeNumber} onChange={(e) => setCurrentRoute({ ...currentRoute, routeNumber: e.target.value })} />

        <label className="falcon-label">Permit Number</label>
        <input type="text" className="falcon-input" value={currentRoute.permitNumber} onChange={(e) => setCurrentRoute({ ...currentRoute, permitNumber: e.target.value })} />

        <label className="falcon-label">Main Town</label>
        <input type="text" className="falcon-input" value={currentRoute.mainTown} onChange={(e) => setCurrentRoute({ ...currentRoute, mainTown: e.target.value })} />

        <label className="falcon-label">Secondary Town</label>
        <input type="text" className="falcon-input" value={currentRoute.secondaryTown} onChange={(e) => setCurrentRoute({ ...currentRoute, secondaryTown: e.target.value })} />

        <label className="falcon-label">Route Type</label>
        <select className="falcon-input" value={currentRoute.routeType} onChange={(e) => setCurrentRoute({ ...currentRoute, routeType: e.target.value })}>
          <option value="">Choose Type</option>
          <option value="Short Distance">Short Distance</option>
          <option value="Long Distance">Long Distance</option>
          <option value="Highway Express">Highway Express</option>
        </select>

        <label className="falcon-label">Ticket Price (Rs.)</label>
<input
  type="number"
  className="falcon-input"
  value={currentRoute.ticketPrice}
  onChange={(e) => setCurrentRoute({ ...currentRoute, ticketPrice: e.target.value })}
/>

      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
        <button className="btn btn-dark" onClick={handleUpdateSubmit}>Update</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AddRoute;
