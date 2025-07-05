import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerHeader from './CustomerHeader';
import { FaBell } from 'react-icons/fa';
import defaultProfile from '../assets/profile-picture.jpg';
import './MyProfile.css'

const MyProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [photo, setPhoto] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobileNumber: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
const [currentPwd, setCurrentPwd] = useState('');
const [newPwd, setNewPwd] = useState('');
const [confirmPwd, setConfirmPwd] = useState('');
const [pastBookings, setPastBookings] = useState([]);


  // ✅ Fetch customer data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/customers/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCustomer(res.data);
        setPhoto(res.data.photo || '');

        // Pre-fill form for edit
        setFormData({
          name: res.data.name,
          username: res.data.username,
          email: res.data.email,
          mobileNumber: res.data.mobileNumber
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgFormData = new FormData();
    imgFormData.append('profilePhoto', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/customers/upload-photo', imgFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setPhoto(res.data.photo);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  // ✅ Save changes from modal
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/customers/update', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setCustomer({ ...customer, ...formData });
      setShowEditModal(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handlePasswordChange = async () => {
  if (newPwd.length < 7) {
    alert("Password must be at least 7 characters.");
    return;
  }

  if (newPwd !== confirmPwd) {
    alert("New passwords do not match.");
    return;
  }

  try {
    const token = localStorage.getItem('token');
    await axios.put('http://localhost:5000/api/customers/change-password', {
      currentPassword: currentPwd,
      newPassword: newPwd
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Password updated successfully');
    setShowPasswordModal(false);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update password');
  }
};

useEffect(() => {
    const fetchPastBookings = async () => {
      if (!customer?._id) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/customer/${customer._id}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const past = res.data.filter((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate < today;
        });

        setPastBookings(past);
      } catch (err) {
        console.error('Failed to fetch past bookings:', err);
      }
    };

    fetchPastBookings();
  }, [customer]);

  if (!customer) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div>
      <CustomerHeader />
      <div className="text-end pe-5 pt-4">
        <FaBell size={22} />
      </div>

      <div className="container mt-4 animate-fade-in">
        <h4 className="mb-4 fw-bold text-center">My Profile</h4>

        <div className="profile-card">
          <div className="me-4 text-center">
            {photo ? (
              <img
                src={photo.startsWith('http') ? photo : `http://localhost:5000${photo}`}
                alt="Profile"
                className="profile-img"
              />
            ) : (
              <div>
                <label htmlFor="upload" className="btn btn-outline-light btn-sm rounded-pill">
                  Upload Photo
                </label>
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          <div className="profile-info">
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Username:</strong> {customer.username}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Number:</strong> {customer.mobileNumber}</p>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>Edit Details</button>
              <button className="btn btn-danger" onClick={() => setShowPasswordModal(true)}>Change Password</button>
            </div>
          </div>
        </div>
        <h5 className="mt-5 mb-3">My History</h5>

{pastBookings.length === 0 ? (
  <p className="text-muted">You have no past bookings.</p>
) : (
  pastBookings.map((booking) => (
    <div key={booking._id} className="history-row">
      <div>{booking.busId?.busNumber || 'N/A'}</div>
      <div>{new Date(booking.bookingDate).toLocaleDateString()}</div>
      <div className="route">
        From {booking.assignmentId?.routeId?.mainTown || '---'} To {booking.assignmentId?.routeId?.secondaryTown || '---'}
      </div>
      <div>{booking.assignmentId?.forwardDepartureTime || '---'}</div>
      <div>Seat - {booking.seatNumbers.join(', ')}</div>
      <div className="action-btn11">
        <button
  className="history-remove-btn"
  onClick={() => alert('Remove functionality not implemented')}
>
  Remove
</button>


      </div>
    </div>
  ))
)}


      </div>

      {/* 🔹 Edit Details Modal */}
      {showEditModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Mobile Number</label>
                  <input type="text" className="form-control"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveChanges}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
  <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Change Password</h5>
          <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="mb-2">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-control" value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="form-label">Confirm New Password</label>
            <input type="password" className="form-control" value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handlePasswordChange}>Change</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default MyProfile;
