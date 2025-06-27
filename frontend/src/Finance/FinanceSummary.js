import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopHeader from '../HRComponents/TopHeader';
import SideBarFinance from '../FinanceComponent/SideBarFinance';
import './FinanceSummary.css';
import { generateFinancePDF } from '../utils/generateFinancePDF';

const FinanceSummary = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  // 🔃 Fetch finance records
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/finance/all') // Replace with your real endpoint
      .then((res) => setRecords(res.data))
      .catch((err) => console.error('Error fetching finance data:', err));
  }, []);

  // 🔍 Filter logic
  const filteredRecords = records.filter((item) => {
  const query = searchQuery.toLowerCase();

  const matchesSearch =
    item.title.toLowerCase().includes(query) ||
    item.mainType.toLowerCase().includes(query) ||
    item.subType.toLowerCase().includes(query);

  const itemMonth = new Date(item.date).toISOString().slice(0, 7); // e.g., "2025-06"
  const matchesMonth = selectedMonth === '' || itemMonth === selectedMonth;

  return matchesSearch && matchesMonth;
});


  const TypeIcons = {
  'Trip Income': '/icons/bus.png',
  'Route Income': '/icons/route.png',
  'Bus Sell Income': '/icons/usd-circle.png',
  'Other Income': '/icons/menu-dots.png',
  'Petty Cash': '/icons/currency.png',
  'Fuel': '/icons/gas-pump-alt.png',
  'Salary': '/icons/user-salary.png',
  'Service': '/icons/sign-posts-wrench.png',
  'Other': '/icons/menu-dots.png'
};

  return (
    <div className='employeeRegister'>
      <TopHeader />
      <div className="main-container d-flex">
        <SideBarFinance />

        <div className="summary-content-area">
          {/* Top Controls */}
          <div className="summary-controls">
            <input
  type="month"
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(e.target.value)}
  className="summary-btn-light"
/>


            <div className="summary-search-box">
              <i className="fas fa-search summary-search-icon"></i>
              <input
                type="text"
                className="summary-search-input"
                placeholder="Search Income"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="summary-btn-dark" onClick={() => generateFinancePDF(filteredRecords)}> 
              <i className="fas fa-download me-2"></i>
              Download PDF
            </button>
          </div>

          <h4 className="summary-section-title">Summary</h4>

          <div className="summary-table-container">
            <div className="summary-table-header">
              <div className="summary-col icon-col">Icon</div>
              <div className="summary-col title-col">Title</div>
              <div className="summary-col type-col">Type</div>
              <div className="summary-col type-col">Type</div>
              <div className="summary-col date-col">Date</div>
              <div className="summary-col amount-col">Amount</div>
            </div>

            <div className="summary-table-body">
              {filteredRecords.map((item, index) => (
                <div className="summary-table-row" key={index}>
                  <div className="summary-col icon-col">
                    <img src={TypeIcons[item.subType] || '/icons/default.png'} alt='icon' className='income-icon-img' />
                  </div>
                  <div className="summary-col title-col">{item.title}</div>
                  <div className="summary-col type-col">{item.mainType}</div>
                  <div className="summary-col type-col">{item.subType}</div>
                  <div className="summary-col date-col">
  {new Date(item.date).toISOString().slice(0, 10).replace(/-/g, '.')}
</div>

                  <div className="summary-col amount-col">Rs.{item.amount}</div>
                </div>
              ))}
              {filteredRecords.length === 0 && (
                <div className="no-records">No matching records found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceSummary;
