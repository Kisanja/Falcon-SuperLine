import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopHeader from '../HRComponents/TopHeader';
import SideBarFinance from '../FinanceComponent/SideBarFinance';
import { generateExpensePDF } from '../utils/generateExpensePDF';

const Expenses = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expensesList, setExpensesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseList, setExpenseList] = useState([]);


  const expenseIcons = {
  'Petty Cash': '/icons/currency.png',
  'Fuel': '/icons/gas-pump-alt.png',
  'Salary': '/icons/user-salary.png',
  'Service': '/icons/sign-posts-wrench.png',
  'Other': '/icons/menu-dots.png'
};

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/finance/all');
      const onlyExpenses = response.data.filter(entry => entry.mainType === 'Expenses');
      setExpensesList(onlyExpenses);
    } catch (err) {
      console.error('Error loading expenses:', err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      mainType: 'Expenses',
      subType: type,
      date,
      amount,
      description
    };
    try {
      await axios.post('http://localhost:5000/api/finance/create', data);
      fetchExpenses();
      setShowAddModal(false);
      setTitle('');
      setType('');
      setDate('');
      setAmount('');
      setDescription('');
    } catch (err) {
      console.error('Create error:', err);
      alert('Something went wrong while adding expense');
    }
  };

  const confirmDelete = (id) => {
    setExpenseToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/finance/delete/${expenseToDelete}`);
      setPopupMessage('Expense deleted successfully!');
      setShowPopup(true);
      fetchExpenses();
    } catch (err) {
      console.error('Delete error:', err);
      setPopupMessage('Failed to delete expense.');
      setShowPopup(true);
    } finally {
      setShowConfirmDelete(false);
      setTimeout(() => setShowPopup(false), 2500);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/finance/update/${selectedExpense._id}`, selectedExpense);
      setPopupMessage('Expense updated successfully!');
      setShowPopup(true);
      fetchExpenses();
    } catch (error) {
      console.error('Update error:', error);
      setPopupMessage('Failed to update expense.');
      setShowPopup(true);
    } finally {
      setShowEditModal(false);
      setTimeout(() => setShowPopup(false), 2500);
    }
  };

  return (
    <div className='employeeRegister'>
      <TopHeader />
      <div className='main-container d-flex'>
        <SideBarFinance />
        <div className='income-content-area'>
          <div className='income-controls-container'>
            <div className='income-controls-left'>
              <button className='income-btn-add' onClick={() => setShowAddModal(true)}>
                <i className='fas fa-plus me-2'></i> Add Expense
              </button>
            </div>
            <div className='income-controls-right'>
              <input type='month' className='income-btn-light' onChange={(e) => setSelectedDate(e.target.value)} />
              <div className='income-search-group'>
                <i className='fas fa-search income-search-icon'></i>
                <input
                  type='text'
                  className='income-search-input'
                  placeholder='Search Expenses'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className='income-btn-download' onClick={() => generateExpensePDF(expensesList)}>
                <i className='fas fa-download me-2'></i> Download PDF
              </button>
            </div>
          </div>

          <h4 className='income-section-title'>Expenses</h4>

          <div className='income-table-wrapper'>
            <div className='income-table-header'>
              <div className='income-table-col'>Icon</div>
              <div className='income-table-col'>Title</div>
              <div className='income-table-col'>Type</div>
              <div className='income-table-col'>Date</div>
              <div className='income-table-col'>Amount</div>
              <div className='income-table-col'>Action</div>
            </div>

            <div className='income-table-body'>
              {expensesList
                .filter(item =>
                  (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.subType.toLowerCase().includes(searchQuery.toLowerCase())) &&
                  (selectedDate === '' || item.date.startsWith(selectedDate))
                )
                .map(item => (
                  <div className='income-table-row' key={item._id}>
                    <img src={expenseIcons[item.subType] || '/icons/default.png'} alt='icon' className='income-icon-img' />
                    <div className='income-table-col'>
                      <div className='income-title'>{item.title}</div>
                      <div className='income-desc'>{item.description}</div>
                    </div>
                    <div className='income-table-col'>{item.subType}</div>
                    <div className='income-table-col'>{item.date.slice(0, 10)}</div>
                    <div className='income-table-col'>Rs.{item.amount}</div>
                    <div className='income-table-col income-actions'>
                      <button className='action-btn edit-action' onClick={() => { setSelectedExpense(item); setShowEditModal(true); }}><i className='fas fa-pen'></i></button>
                      <button className='action-btn delete-action' onClick={() => confirmDelete(item._id)}><i className='fas fa-trash'></i></button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <div className='income-modal-overlay'>
          <div className='income-modal-container'>
            <h2 className='income-modal-title'>Add Expense</h2>
            <form onSubmit={handleAddSubmit}>
              <input type='text' placeholder='Enter title' value={title} onChange={(e) => setTitle(e.target.value)} className='income-modal-input' required />
              <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="income-modal-input"
                    required
                    >
                    <option value="">Select Expense Type</option>
                    <option value="Petty Cash">Petty Cash</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Salary">Salary</option>
                    <option value="Service">Service</option>
                    <option value="Other">Other</option>
                </select>

              <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className='income-modal-input' required />
              <input type='number' placeholder='Enter amount' value={amount} onChange={(e) => setAmount(e.target.value)} className='income-modal-input' required />
              <textarea placeholder='Enter description (max 50 characters)' maxLength={50} value={description} onChange={(e) => setDescription(e.target.value)} className='income-modal-textarea' required></textarea>
              <div className='income-modal-button-group'>
                <button type='submit' className='income-modal-submit-btn'>Add</button>
                <button type='button' onClick={() => setShowAddModal(false)} className='income-modal-cancel-btn'>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <div className='income-confirm-overlay'>
          <div className='income-confirm-box'>
            <p>Are you sure you want to delete this expense?</p>
            <div className='income-confirm-buttons'>
              <button onClick={handleDeleteConfirmed} className='income-confirm-yes'>Yes, Delete</button>
              <button onClick={() => setShowConfirmDelete(false)} className='income-confirm-no'>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className='income-popup-message'>
          <p>{popupMessage}</p>
        </div>
      )}

      {showEditModal && selectedExpense && (
        <div className='income-modal-overlay'>
          <div className='income-modal-container'>
            <h2 className='income-modal-title'>Edit Expense</h2>
            <form onSubmit={handleUpdateSubmit}>
              <input type='text' value={selectedExpense.title} onChange={(e) => setSelectedExpense({ ...selectedExpense, title: e.target.value })} className='income-modal-input' required />
              <select
                value={selectedExpense.subType}
                onChange={(e) => setSelectedExpense({ ...selectedExpense, subType: e.target.value })}
                className="income-modal-input"
                required
                >
                <option value="">Select Expense Type</option>
                <option value="Petty Cash">Petty Cash</option>
                <option value="Fuel">Fuel</option>
                <option value="Salary">Salary</option>
                <option value="Service">Service</option>
                <option value="Other">Other</option>
             </select>

              <input type='date' value={selectedExpense.date?.slice(0, 10)} onChange={(e) => setSelectedExpense({ ...selectedExpense, date: e.target.value })} className='income-modal-input' required />
              <input type='number' value={selectedExpense.amount} onChange={(e) => setSelectedExpense({ ...selectedExpense, amount: e.target.value })} className='income-modal-input' required />
              <textarea value={selectedExpense.description} onChange={(e) => setSelectedExpense({ ...selectedExpense, description: e.target.value })} maxLength={50} className='income-modal-textarea' required></textarea>
              <div className='income-modal-button-group'>
                <button type='submit' className='income-modal-submit-btn'>Update</button>
                <button type='button' onClick={() => setShowEditModal(false)} className='income-modal-cancel-btn'>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
