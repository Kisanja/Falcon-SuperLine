import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopHeader from '../HRComponents/TopHeader';
import SideBarFinance from '../FinanceComponent/SideBarFinance';
import './income.css';
import { generateIncomePDF } from '../utils/generateIncomePDF';

const Income = () => {
  // 🔸 Modal States
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [incomeTitle, setIncomeTitle] = useState('');
  const [incomeType, setIncomeType] = useState('');
  const [incomeDate, setIncomeDate] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');
    // 🔸 Confirm Delete
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);

    // 🔸 Feedback Popup
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [incomeList, setIncomeList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

useEffect(() => {
  fetchIncomeData();
}, []);

const fetchIncomeData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/finance/all');
    const incomeOnly = response.data.filter(entry => entry.mainType === 'Income');
    setIncomeList(incomeOnly);
  } catch (error) {
    console.error('Error fetching income data:', error);
  }
};

const incomeTypeIcons = {
  'Trip Income': '/icons/bus.png',
  'Route Income': '/icons/route.png',
  'Bus Sell Income': '/icons/usd-circle.png',
  'Other Income': '/icons/menu-dots.png'
};

const handleAddIncomeSubmit = async (e) => {
  e.preventDefault();

  const newIncome = {
    title: incomeTitle,
    mainType: 'Income',           // 🔸 Fixed as "Income"
    subType: incomeType,          // 🔸 The selected subtype (Trip Income, etc.)
    date: incomeDate,
    amount: incomeAmount,
    description: incomeDescription
  };

  try {
    await axios.post('http://localhost:5000/api/finance/create', newIncome);
    console.log('Income created successfully');
    fetchIncomeData(); // refresh table
    // Reset form
    setShowAddIncomeModal(false);
    setIncomeTitle('');
    setIncomeType('');
    setIncomeDate('');
    setIncomeAmount('');
    setIncomeDescription('');
  } catch (error) {
    console.error('Error adding income:', error);
    alert('Something went wrong while adding income');
  }
};

const confirmDeleteIncome = (incomeId) => {
  setIncomeToDelete(incomeId);
  setShowConfirmDelete(true);
};

const handleDeleteConfirmed = async () => {
  try {
    await axios.delete(`http://localhost:5000/api/finance/delete/${incomeToDelete}`);
    setPopupMessage('Income deleted successfully!');
    setShowPopup(true);
    fetchIncomeData(); // Refresh data
  } catch (error) {
    console.error('Delete error:', error);
    setPopupMessage('Failed to delete income.');
    setShowPopup(true);
  } finally {
    setShowConfirmDelete(false);
    setIncomeToDelete(null);
    setTimeout(() => setShowPopup(false), 2500);
  }
};

const handleUpdateIncomeSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://localhost:5000/api/finance/update/${selectedIncome._id}`, selectedIncome);
    setPopupMessage('Income updated successfully!');
    setShowPopup(true);
    fetchIncomeData(); // Refresh
  } catch (error) {
    console.error('Update error:', error);
    setPopupMessage('Failed to update income.');
    setShowPopup(true);
  } finally {
    setShowEditModal(false);
    setTimeout(() => setShowPopup(false), 2500);
  }
};

  return (
    <div className='employeeRegister'>
      <TopHeader />
      <div className="main-container d-flex">
        <SideBarFinance />

        <div className="income-content-area">
          {/* Header Buttons */}
          <div className="income-controls-container">
            <div className="income-controls-left">
              <button className="income-btn-add" onClick={() => setShowAddIncomeModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Add Income
              </button>
            </div>

            <div className="income-controls-right">
              <input
  type="month"
  className="income-btn-light"
  onChange={(e) => setSelectedDate(e.target.value)}
/>


              <div className="income-search-group">
                <i className="fas fa-search income-search-icon"></i>
                <input
                    type="text"
                    className="income-search-input"
                    placeholder="Search Income"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
              </div>

              <button onClick={() => generateIncomePDF(incomeList)} className='income-btn-download'>
  <i className="fas fa-download me-2"></i> Download PDF
</button>
            </div>
          </div>

          {/* Table Section */}
          <h4 className="income-section-title">Income</h4>

          <div className="income-table-wrapper">
            <div className="income-table-header">
              <div className="income-table-col">Icon</div>
              <div className="income-table-col">Title</div>
              <div className="income-table-col">Type</div>
              <div className="income-table-col">Date</div>
              <div className="income-table-col">Amount</div>
              <div className="income-table-col">Action</div>
            </div>

            <div className="income-table-body">
              {incomeList
  .filter(item =>
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.subType.toLowerCase().includes(searchQuery.toLowerCase()))
    &&
    (selectedDate === '' || item.date.startsWith(selectedDate)) // YYYY-MM match
  )
  .map((item, index) => (
    <div className="income-table-row" key={item._id || index}>
  <img
  src={incomeTypeIcons[item.subType] || '/icons/default.png'}
  alt="icon"
  className="income-icon-img"
/>



  <div className="income-table-col">
    <div className="income-title">{item.title}</div>
    <div className="income-desc">{item.description}</div>
  </div>

  <div className="income-table-col">{item.subType}</div>
  <div className="income-table-col">{item.date?.slice(0, 10)}</div>
  <div className="income-table-col">Rs.{item.amount}</div>
  <div className="income-table-col income-actions">
    <button
  className="action-btn edit-action"
  onClick={() => {
    setSelectedIncome(item);
    setShowEditModal(true);
  }}
>
  <i className="fas fa-pen"></i>
</button>

    <button
  className="action-btn delete-action"
  onClick={() => confirmDeleteIncome(item._id)}
>
  <i className="fas fa-trash"></i>
</button>


  </div>
</div>

              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Income Modal */}
      {showAddIncomeModal && (
        <div className="income-modal-overlay">
          <div className="income-modal-container">
            <h2 className="income-modal-title">Add Income</h2>
            <form onSubmit={handleAddIncomeSubmit}>
              <input
                type="text"
                placeholder="Enter title"
                value={incomeTitle}
                onChange={(e) => setIncomeTitle(e.target.value)}
                className="income-modal-input"
                required
              />
                            <select
  value={incomeType}
  onChange={(e) => setIncomeType(e.target.value)}
  className="income-modal-input"
  required
>
  <option value="">Select income type</option>
  <option value="Trip Income">Trip Income</option>
  <option value="Route Income">Route Income</option>
  <option value="Bus Sell Income">Bus Sell Income</option>
  <option value="Other Income">Other Income</option>
</select>

              <input
                type="date"
                value={incomeDate}
                onChange={(e) => setIncomeDate(e.target.value)}
                className="income-modal-input"
                required
              />
              <input
                type="number"
                placeholder="Enter amount"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                className="income-modal-input"
                required
              />
              <textarea
                placeholder="Enter description (max 50 characters)"
                maxLength={50}
                value={incomeDescription}
                onChange={(e) => setIncomeDescription(e.target.value)}
                className="income-modal-textarea"
                required
              ></textarea>

              <div className="income-modal-button-group">
                <button type="submit" className="income-modal-submit-btn">Add</button>
                <button type="button" onClick={() => setShowAddIncomeModal(false)} className="income-modal-cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showConfirmDelete && (
  <div className="income-confirm-overlay">
    <div className="income-confirm-box">
      <p>Are you sure you want to delete this income?</p>
      <div className="income-confirm-buttons">
        <button onClick={handleDeleteConfirmed} className="income-confirm-yes">Yes, Delete</button>
        <button onClick={() => setShowConfirmDelete(false)} className="income-confirm-no">Cancel</button>
      </div>
    </div>
  </div>
)}

{showPopup && (
  <div className="income-popup-message">
    <p>{popupMessage}</p>
  </div>
)}

{showEditModal && selectedIncome && (
  <div className="income-modal-overlay">
    <div className="income-modal-container">
      <h2 className="income-modal-title">Edit Income</h2>
      <form onSubmit={handleUpdateIncomeSubmit}>
        <input
          type="text"
          value={selectedIncome.title}
          onChange={(e) => setSelectedIncome({ ...selectedIncome, title: e.target.value })}
          className="income-modal-input"
          required
        />
        <select
  value={selectedIncome.subType}
  onChange={(e) => setSelectedIncome({ ...selectedIncome, subType: e.target.value })}
  className="income-modal-input"
  required
>
  <option value="">Select Income Type</option>
  <option value="Trip Income">Trip Income</option>
  <option value="Route Income">Route Income</option>
  <option value="Bus Sell Income">Bus Sell Income</option>
  <option value="Other Income">Other Income</option>
</select>

        <input
          type="date"
          value={selectedIncome.date?.slice(0, 10)}
          onChange={(e) => setSelectedIncome({ ...selectedIncome, date: e.target.value })}
          className="income-modal-input"
          required
        />
        <input
          type="number"
          value={selectedIncome.amount}
          onChange={(e) => setSelectedIncome({ ...selectedIncome, amount: e.target.value })}
          className="income-modal-input"
          required
        />
        <textarea
          maxLength={50}
          value={selectedIncome.description}
          onChange={(e) => setSelectedIncome({ ...selectedIncome, description: e.target.value })}
          className="income-modal-textarea"
          required
        ></textarea>

        <div className="income-modal-button-group">
          <button type="button" onClick={() => setShowEditModal(false)} className="income-modal-cancel-btn">Cancel</button>
          <button type="submit" className="income-modal-submit-btn">Update</button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Income;
