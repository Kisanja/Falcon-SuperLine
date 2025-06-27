import React from 'react';
import './SideBarBus.css';
import { Link, useLocation } from 'react-router-dom';
 
const SideBarFinance = () => {
  const location = useLocation();

  const buttons = [
    { label: 'Dashboard', path: '/finance-dashboard' },
    { label: 'Add Income', path: '/add-income' },
    { label: 'Add Expenses', path: '/add-expenses' },
    { label: 'Add Salary', path: '/add-finance-salary' },
    { label: 'Summary', path: '/finance-summary' }
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

export default SideBarFinance;
