import React from 'react';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
  const location = useLocation();

  const buttons = [
    { label: 'Dashboard', path: '/HR-dashboard' },
    { label: 'Add Employee', path: '/add-employee' },
    { label: 'Add Salary', path: '/add-salary' },
    { label: 'View Employees', path: '/view-employees' },
    { label: 'Retired Employees', path: '/retired-employees' }
  ];

  return (
    <div className="sidebar d-flex flex-column justify-content-between p-3">
      <div className="sidebar-btn-group">
        {buttons.map((btn) => (
          <Link
            key={btn.label}
            to={btn.path}
            className={`custom-btn w-100 ${location.pathname === btn.path ? 'active' : ''}`}
          >
            {btn.label}
          </Link>
        ))}
      </div>

      <div>
        <button className="logout-btn w-100">Logout</button>
      </div>
    </div>
  );
};

export default SideBar;
