import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideBarBus = () => {
  const location = useLocation();

  const buttons = [
    { label: 'Dashboard', path: '/Bus-dashboard' },
    { label: 'Add Bus', path: '/add-bus' },
    { label: 'Add Route', path: '/add-route' },
    { label: 'Assign Employees', path: '/assign-employee' },
    { label: 'Assign Routes', path: '/assign-route' },
    { label: 'Summary', path: '/bus-summary' }
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

export default SideBarBus;
