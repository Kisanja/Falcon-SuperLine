import React from 'react';
import './TopHeader.css'; // We’ll add minor styles here
import { FaClock, FaCalendarAlt, FaUser } from 'react-icons/fa';

const TopHeader = () => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  return (
    <div className="top-header d-flex justify-content-between align-items-center px-4 py-2">
      {/* Left side: Logo and Brand Name */}
      <div className="d-flex align-items-center">
        <img src="/logo/logo1.png" alt="Logo" className="logo-img me-2" />
        <img src="/logo/logotext.png" alt="Company Name" className="company-name-img" />
      </div>

      {/* Right side: Time, Date, Username */}
      <div className="d-flex align-items-center gap-4">
        <div className="d-flex align-items-center gap-2 text-white">
          <FaClock />
          <span>{currentTime}</span>
        </div>
        <div className="d-flex align-items-center gap-2 text-white">
          <FaCalendarAlt />
          <span>{currentDate}</span>
        </div>
        <div className="d-flex align-items-center gap-2 text-white">
          <FaUser />
          <span>UserName</span>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
