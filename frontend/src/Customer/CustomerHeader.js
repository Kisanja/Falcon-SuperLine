import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import logoImg from '../assets/logo1.png';
import nameImg from '../assets/logotext.png';
import './CustomerHeader.css';

const CustomerHeader = () => {
  const navigate = useNavigate();

  // ✅ Get customer from localStorage (if logged in)
  const customer = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg px-4 custom-header fixed-top">
      {/* 🔹 Logo */}
      <div className="d-flex align-items-center me-4">
        <img src={logoImg} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
        <img src={nameImg} alt="Name" style={{ height: '50px' }} />
      </div>

      {/* 🔹 Nav Links */}
      <div className="d-flex justify-content-center flex-grow-1">
        <ul className="navbar-nav gap-4">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/customer/book-ticket" className="nav-link">Book Ticket</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/customer/gallery" className="nav-link">Gallery</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/customer/support" className="nav-link">Support</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/customer/my-bookings" className="nav-link">My Bookings</NavLink>
          </li>
        </ul>
      </div>

      {/* 🔹 Right Side: Conditional */}
      {customer ? (
        // ✅ Logged In View: Show user name + dropdown
        <div className="dropdown">
          <button
            className="btn btn-dark d-flex align-items-center dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUserCircle size={22} color="white" className="me-2" />
            <span className="text-white">{customer.name}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <NavLink className="dropdown-item" to="/customer/profile">My Profile</NavLink>
            </li>
            <li>
              <NavLink className="dropdown-item" to="/customer/settings">Settings</NavLink>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      ) : (
        // ❌ Not Logged In View: Show login/register buttons
        <div className="d-flex gap-2">
  <button
    className="btn"
    style={{
      backgroundColor: 'transparent',
      color: '#ffffff',
      border: '1px solid #ffffff',
      padding: '6px 16px',
      borderRadius: '6px'
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = '#ffffff';
      e.target.style.color = '#1c1c2c';
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.color = '#ffffff';
    }}
    onClick={() => navigate('/login')}
  >
    Login
  </button>

  <button
    className="btn"
    style={{
      backgroundColor: '#ffffff',
      color: '#1c1c2c',
      padding: '6px 16px',
      border: '1px solid #ffffff',
      borderRadius: '6px'
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = '#f0f0f0';
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = '#ffffff';
    }}
    onClick={() => navigate('/register')}
  >
    Register
  </button>
</div>

      )}
    </nav>
  );
};

export default CustomerHeader;
