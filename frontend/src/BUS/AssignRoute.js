import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBarBus from '../BUSComponent/SideBarBus';
import TopHeader from '../HRComponents/TopHeader';
import { FaSearch } from 'react-icons/fa';
import './AssignRoute.css';

const AssignRoute = () => {
  const [selectedView, setSelectedView] = useState('assign-route');

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const [busList, setBusList] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showAssignRouteModal, setShowAssignRouteModal] = useState(false);
  const [selectedBusForRoute, setSelectedBusForRoute] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [scheduleType, setScheduleType] = useState('Every Day');
  const [date, setDate] = useState('');
  const [forwardDepartureTime, setForwardDepartureTime] = useState('');
  const [forwardArrivalTime, setForwardArrivalTime] = useState('');
  const [returnDepartureTime, setReturnDepartureTime] = useState('');
  const [returnArrivalTime, setReturnArrivalTime] = useState('');
  const [showAssignBusModal, setShowAssignBusModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null); // The route user clicked "Assign Bus" on
  const [selectedBusId, setSelectedBusId] = useState('');
  const [assignBusType, setAssignBusType] = useState('');
  const [assignSeatCapacity, setAssignSeatCapacity] = useState('');
  const [assignScheduleType, setAssignScheduleType] = useState('Every Day');
  const [assignDate, setAssignDate] = useState('');
  const [assignForwardDepartureTime, setAssignForwardDepartureTime] = useState('');
  const [assignForwardArrivalTime, setAssignForwardArrivalTime] = useState('');
  const [assignReturnDepartureTime, setAssignReturnDepartureTime] = useState('');
  const [assignReturnArrivalTime, setAssignReturnArrivalTime] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [assignedList, setAssignedList] = useState([]);
  const [popupType, setPopupType] = useState('success'); // or 'error'
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
  axios.get('http://localhost:5000/api/assignments/assigned')
    .then((res) => setAssignedList(res.data))
    .catch((err) => console.error('Failed to fetch assigned routes:', err));
}, []);

 useEffect(() => {
  axios
    .get('http://localhost:5000/api/buses')
    .then((res) => setBusList(res.data))
    .catch((err) => console.error('Failed to fetch unassigned buses:', err));
}, []);

useEffect(() => {
  // Get all routes (assigned and unassigned)
axios.get('http://localhost:5000/api/routes')

    .then(res => setRoutes(res.data))
    .catch(err => console.error('Failed to fetch unassigned routes:', err));
}, []);


useEffect(() => {
  if (selectedBusId) {
    const selected = busList.find((bus) => bus._id === selectedBusId);
    if (selected) {
      setAssignBusType(selected.type);
      setAssignSeatCapacity(selected.seatCapacity);
    }
  } else {
    setAssignBusType('');
    setAssignSeatCapacity('');
  }
}, [selectedBusId, busList]);

const resetAssignRouteForm = () => {
  setSelectedRouteId('');
  setScheduleType('Every Day');
  setDate('');
  setForwardDepartureTime('');
  setForwardArrivalTime('');
  setReturnDepartureTime('');
  setReturnArrivalTime('');
};

const createBusRouteAssignment = async (assignmentData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/assignments/assign', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Assignment failed:', error);
    throw error;
  }
};

const createBusAssignment = async (assignmentData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/assignments/assign', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Bus assignment failed:', error);
    throw error;
  }
};

const handleRemoveAssignment = async (id) => {
  if (window.confirm("Are you sure you want to remove this assignment?")) {
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`);
      alert("✅ Assignment removed");
      setViewModalOpen(false);
      // Refresh list
      const refreshed = await axios.get('http://localhost:5000/api/assignments/assigned');
      setAssignedList(refreshed.data);
    } catch (err) {
      alert("❌ Failed to remove assignment");
    }
  }
};

const filteredBusList = busList.filter(bus =>
  bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  bus.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
  bus.brand.toLowerCase().includes(searchQuery.toLowerCase())
);

const filteredRoutes = routes.filter(route =>
  route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  route.permitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  route.mainTown.toLowerCase().includes(searchQuery.toLowerCase()) ||
  route.secondaryTown.toLowerCase().includes(searchQuery.toLowerCase())
);

const filteredAssignedList = assignedList.filter(item =>
  item.busId?.busNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.routeId?.permitNumber?.toLowerCase().includes(searchQuery.toLowerCase())
);


  return (
    <div className="employeeRegister">
      <TopHeader />
      <div className="main-container d-flex">
        <SideBarBus />
        <div className="col-md-10 ps-5 pe-4">
          {/* Top Bar */}
          <div className="assign-top-bar d-flex justify-content-between align-items-center mt-4 mb-3">
            <div className="btn-group">
              <button className={`btn ${selectedView === 'assign-route' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleViewChange('assign-route')}>Assign Route</button>
              <button className={`btn ${selectedView === 'assign-bus' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleViewChange('assign-bus')}>Assign Bus</button>
              <button className={`btn ${selectedView === 'assigned-list' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleViewChange('assigned-list')}>Assigned Routes</button>
            </div>

            <div className="assign-search-box d-flex align-items-center px-3 py-2 rounded">
              <FaSearch className="me-2" />
              <input
                type="text"
                className="form-control border-0 p-0"
                placeholder="Search Bus or Route"
                style={{ boxShadow: 'none', background: 'transparent' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Section Content */}
          <div className="assignment-view-area mt-4">
            {selectedView === 'assign-route' && (
              <>
                <h5 className="fw-bold mb-3">Assign Route from the Bus</h5>
                <table className="assign-route-table">
                  <colgroup>
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '17%' }} />
                  </colgroup>
                  <thead className="assign-route-thead">
                    <tr>
                      <th>Image</th>
                      <th>Bus Number</th>
                      <th>Brand</th>
                      <th>Model</th>
                      <th>Seat Capacity</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                </table>
                <div className="assign-route-table-wrapper">
                  <table className="assign-route-table-body">
                    <colgroup>
                      <col style={{ width: '8%' }} />
                      <col style={{ width: '15%' }} />
                      <col style={{ width: '17%' }} />
                      <col style={{ width: '17%' }} />
                      <col style={{ width: '13%' }} />
                      <col style={{ width: '13%' }} />
                      <col style={{ width: '17%' }} />
                    </colgroup>
                    <tbody>
                      {filteredBusList.map((bus, index) => (
                        <tr key={index} className="assign-route-row">
                          <td>
                            <img
                              src={bus.image.startsWith('http') ? bus.image : `http://localhost:5000/uploads/${bus.image}`}
                              alt="Bus"
                              className="assign-route-avatar-img"
                            />
                          </td>
                          <td>{bus.busNumber}</td>
                          <td>{bus.brand}</td>
                          <td>{bus.model}</td>
                          <td>{bus.seatCapacity}</td>
                          <td>{bus.type}</td>
                          <td><button
                              className="assign-route-btn"
                              onClick={() => {
                                setSelectedBusForRoute(bus);
                                setShowAssignRouteModal(true);
                              }}
                            >
                              Assign Route
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {selectedView === 'assign-bus' && (
              <>
                <h5 className="fw-bold mb-3">Assign Bus from the Route</h5>
                <table className="assign-bus-table">
                  <colgroup>
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '14%' }} />
                  </colgroup>
                  <thead className="assign-bus-thead">
                    <tr>
                      <th>Route Number</th>
                      <th>Permit Number</th>
                      <th>Main Town</th>
                      <th>Second Town</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                </table>
                <div className="assign-bus-table-wrapper">
                  <table className="assign-bus-table-body">
                    <colgroup>
                      <col style={{ width: '16%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '14%' }} />
                    </colgroup>
                    <tbody>
  {filteredRoutes.map((route, index) => (
    <tr key={index} className="assign-bus-row">
      <td>{route.routeNumber}</td>
      <td>{route.permitNumber}</td>
      <td>{route.mainTown}</td>
      <td>{route.secondaryTown}</td>
      <td>{route.routeType}</td>
      <td><button
  className="assign-bus-btn"
  onClick={() => {
    setSelectedRoute(route); // set clicked route
    setShowAssignBusModal(true);
  }}
>
  Assign Bus
</button>
</td>
    </tr>
  ))}
</tbody>

                  </table>
                </div>
              </>
            )}

            {selectedView === 'assigned-list' && (
  <>
    <h5 className="fw-bold mb-3">Assigned Buses</h5>
    <table className="assigned-list-table">
      <colgroup>
        <col style={{ width: '15%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '17%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '15%' }} />
      </colgroup>
      <thead className="assigned-list-thead">
        <tr>
          <th>Bus Numbe</th>
          <th>Permit Number</th>
          <th>scheduleType</th>
          <th>Date</th>
          <th>Departure Time</th>
          <th>Return Time</th>
          <th>View</th>
        </tr>
      </thead>
    </table>
    <div className="assigned-list-table-wrapper">
      <table className="assigned-list-table-body">
        <colgroup>
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
        </colgroup>
        <tbody>
  {filteredAssignedList.map((item, index) => (
    <tr key={index} className="assigned-list-row">
      <td>{item.busId?.busNumber || '-'}</td>
      <td>{item.routeId?.permitNumber || '-'}</td>
      <td>{item.scheduleType}</td>
      <td>{item.date || 'Every Day'}</td>
      <td>{item.forwardDepartureTime || '-'}</td>
      <td>{item.returnDepartureTime || '-'}</td>
      <td>
        <button
            className="assigned-list-btn"
            onClick={() => {
              setSelectedAssignment(item);
              setViewModalOpen(true);
            }}
          >
            View More
        </button>

      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  </>
)}

{showAssignRouteModal && (
  <div className="assign-route-modal-overlay">
    <div className="assign-route-modal-box">
  {/* Header */}
  <div className="assign-route-modal-header">
    <h5 className="assign-route-modal-title">Assign Route Details</h5>
  </div>

  {/* Scrollable Body */}
  <div className="assign-route-modal-body">
    <div className="assign-route-form-group mb-3">
      <label className="assign-route-form-label">Route Number</label>
      <select
        className="assign-route-form-input form-control"
        value={selectedRouteId}
        onChange={(e) => setSelectedRouteId(e.target.value)}
      >
        <option value="">-- Select Route --</option>
        {routes.map(route => (
          <option key={route._id} value={route._id}>
            {route.routeNumber}
          </option>
        ))}
      </select>
    </div>

    {selectedRouteId && (
      <>
        <div className="assign-route-static-text mb-2"><strong>Main Town:</strong> {routes.find(r => r._id === selectedRouteId)?.mainTown}</div>
        <div className="assign-route-static-text mb-3"><strong>Secondary Town:</strong> {routes.find(r => r._id === selectedRouteId)?.secondaryTown}</div>
      </>
    )}

    <div className="assign-route-form-group mb-3">
      <label className="assign-route-form-label">Schedule Type</label>
      <div className="assign-route-form-radio-group">
        <label className="me-3">
          <input
            type="radio"
            name="scheduleType"
            value="Every Day"
            checked={scheduleType === 'Every Day'}
            onChange={() => setScheduleType('Every Day')}
          /> Every Day
        </label>
        <label>
          <input
            type="radio"
            name="scheduleType"
            value="Specific Date"
            checked={scheduleType === 'Specific Date'}
            onChange={() => setScheduleType('Specific Date')}
          /> Specific Date
        </label>
      </div>
    </div>

    {scheduleType === 'Specific Date' && (
      <div className="assign-route-form-group mb-3">
        <label className="assign-route-form-label">Select Date</label>
        <input
          type="date"
          className="assign-route-form-input form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
    )}

    <div className="assign-route-form-group mb-2">
      <label className="assign-route-form-label">Forward Departure Time</label>
      <input
        type="time"
        className="assign-route-form-input form-control"
        value={forwardDepartureTime}
        onChange={(e) => setForwardDepartureTime(e.target.value)}
      />
    </div>

    <div className="assign-route-form-group mb-2">
      <label className="assign-route-form-label">Forward Arrival Time</label>
      <input
        type="time"
        className="assign-route-form-input form-control"
        value={forwardArrivalTime}
        onChange={(e) => setForwardArrivalTime(e.target.value)}
      />
    </div>

    <div className="assign-route-form-group mb-2">
      <label className="assign-route-form-label">Return Departure Time</label>
      <input
        type="time"
        className="assign-route-form-input form-control"
        value={returnDepartureTime}
        onChange={(e) => setReturnDepartureTime(e.target.value)}
      />
    </div>

    <div className="assign-route-form-group mb-3">
      <label className="assign-route-form-label">Return Arrival Time</label>
      <input
        type="time"
        className="assign-route-form-input form-control"
        value={returnArrivalTime}
        onChange={(e) => setReturnArrivalTime(e.target.value)}
      />
    </div>
  </div>

  {/* Fixed Footer */}
  <div className="assign-route-modal-footer d-flex justify-content-end">
    <button
      className="assign-route-btn-cancel me-2"
      onClick={() => {
        resetAssignRouteForm();
        setShowAssignRouteModal(false);
      }}
    >
      Cancel
    </button>

    <button
  className="assign-route-btn-submit"
  onClick={async () => {
    try {
      if (!selectedBusForRoute || !selectedRouteId) {
        alert('Please select a bus and a route.');
        return;
      }

      await createBusRouteAssignment({
  busId: selectedBusForRoute._id,
  routeId: selectedRouteId,
  scheduleType,
  ...(scheduleType === 'Specific Date' && { date }),
  forwardDepartureTime,
  forwardArrivalTime,
  returnDepartureTime,
  returnArrivalTime
});

// 🧼 Reset modal and form
setShowAssignRouteModal(false);
resetAssignRouteForm();

// ✅ Fetch latest unassigned buses
const refreshed = await axios.get('http://localhost:5000/api/assignments/unassigned-buses');
setBusList(refreshed.data);

setPopupType('success');
setPopupMessage('Route assigned to bus successfully!');
setShowPopup(true);


    } catch (err) {
      setPopupType('error');
setPopupMessage('Failed to assign route. Please try again.');
setShowPopup(true);

    }
  }}
>
  Assign
</button>

  </div>
</div>

  </div>
)}

{showAssignBusModal && (
  <div className="assign-bus-modal-overlay">
    <div className="assign-bus-modal-content">
      <h5 className="mb-3">Assign Bus to Route: {selectedRoute?.routeNumber}</h5>

      <div className="row mb-2">
        <div className="col-md-6">
          <label className="form-label">Bus Number</label>
          <select
            className="form-select assign-bus-input"
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
          >
            <option value="">-- Select Bus --</option>
            {busList.map((bus) => (
              <option key={bus._id} value={bus._id}>{bus.busNumber}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Bus Type</label>
          <input className="form-control assign-bus-input" value={assignBusType} readOnly />
        </div>

        <div className="col-md-3">
          <label className="form-label">Seat Capacity</label>
          <input className="form-control assign-bus-input" value={assignSeatCapacity} readOnly />
        </div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4">
          <label className="form-label">Schedule Type</label>
          <select
            className="form-select assign-bus-input"
            value={assignScheduleType}
            onChange={(e) => setAssignScheduleType(e.target.value)}
          >
            <option>Every Day</option>
            <option>Specific Date</option>
          </select>
        </div>

              {assignScheduleType === 'Specific Date' && (
                <div className="col-md-4">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control assign-bus-input"
                    value={assignDate}
                    onChange={(e) => setAssignDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="row mb-2">
              <div className="col-md-3">
                <label className="form-label">Forward Departure</label>
                <input
                  type="time"
                  className="form-control assign-bus-input"
                  value={assignForwardDepartureTime}
                  onChange={(e) => setAssignForwardDepartureTime(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Forward Arrival</label>
                <input
                  type="time"
                  className="form-control assign-bus-input"
                  value={assignForwardArrivalTime}
                  onChange={(e) => setAssignForwardArrivalTime(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Return Departure</label>
                <input
                  type="time"
                  className="form-control assign-bus-input"
                  value={assignReturnDepartureTime}
                  onChange={(e) => setAssignReturnDepartureTime(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Return Arrival</label>
                <input
                  type="time"
                  className="form-control assign-bus-input"
                  value={assignReturnArrivalTime}
                  onChange={(e) => setAssignReturnArrivalTime(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-secondary me-2 assign-bus-cancel-btn"
                onClick={() => {
                  setShowAssignBusModal(false);
                  setSelectedRoute(null);
                  setSelectedBusId('');
                  setAssignScheduleType('Every Day');
                  setAssignDate('');
                  setAssignForwardDepartureTime('');
                  setAssignForwardArrivalTime('');
                  setAssignReturnDepartureTime('');
                  setAssignReturnArrivalTime('');
                }}
              >
                Cancel
              </button>
              <button
  className="btn btn-dark assign-bus-submit-btn"
  onClick={async () => {
    try {
      if (!selectedRoute || !selectedBusId) {
        setPopupType('error');
        setPopupMessage('Please select both a route and a bus.');
        setShowPopup(true);
        return;
      }

      await createBusAssignment({
        busId: selectedBusId,
        routeId: selectedRoute._id,
        scheduleType: assignScheduleType,
        ...(assignScheduleType === 'Specific Date' && { date: assignDate }),
        forwardDepartureTime: assignForwardDepartureTime,
        forwardArrivalTime: assignForwardArrivalTime,
        returnDepartureTime: assignReturnDepartureTime,
        returnArrivalTime: assignReturnArrivalTime
      });

      setShowAssignBusModal(false);
      setSelectedRoute(null);
      setSelectedBusId('');
      setAssignScheduleType('Every Day');
      setAssignDate('');
      setAssignForwardDepartureTime('');
      setAssignForwardArrivalTime('');
      setAssignReturnDepartureTime('');
      setAssignReturnArrivalTime('');

      setPopupType('success');
      setPopupMessage('Bus assigned to route successfully!');
      setShowPopup(true);
    } catch (err) {
      setPopupType('error');
      setPopupMessage('Failed to assign bus. Please try again.');
      setShowPopup(true);
    }
  }}
>
  Assign Bus
</button>

            </div>
          </div>
        </div>
      )}
{showPopup && (
  <div className="assign-popup-overlay">
    <div className={`assign-popup-box ${popupType}`}>
      <p className="assign-popup-message">{popupMessage}</p>
      <button className="assign-popup-close-btn" onClick={() => setShowPopup(false)}>
        OK
      </button>
    </div>
  </div>
)}

{viewModalOpen && selectedAssignment && (
  <div className="assign-view-modal-overlay">
    <div className="assign-view-modal-box">
      <h2 className="assign-view-modal-title">Assignment Details</h2>
      
      <div className="assign-view-details">
        <img
  src={
    selectedAssignment.busId?.image?.startsWith('http')
      ? selectedAssignment.busId.image
      : selectedAssignment.busId?.image
      ? `http://localhost:5000/uploads/${selectedAssignment.busId.image}`
      : '/placeholder.png'
  }
  alt="Bus"
  className="assign-view-image"
/>

        <p><strong>Bus Number:</strong> {selectedAssignment.busId?.busNumber}</p>
        <p><strong>Route Number:</strong> {selectedAssignment.routeId?.routeNumber}</p>
        <p><strong>Bus Type:</strong> {selectedAssignment.busId?.type}</p>
        <p><strong>Route Type:</strong> {selectedAssignment.routeId?.routeType}</p>
      </div>

      <div className="assign-view-modal-footer">
        <button
          className="assign-view-btn-cancel"
          onClick={() => setViewModalOpen(false)}
        >
          Close
        </button>
        <button
          className="assign-view-btn-remove"
          onClick={() => handleRemoveAssignment(selectedAssignment._id)}
        >
          Remove Route
        </button>
      </div>
    </div>
  </div>
)}


          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignRoute;
