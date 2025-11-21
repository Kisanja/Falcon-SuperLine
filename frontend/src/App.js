import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EmployeeRegister from './HR/EmployeeRegister';
import AddBus from './BUS/AddBus';
import AddRoute from './BUS/AddRoute';
import BusDashboard from './BUS/BusDashboard';
import AssignRoute from './BUS/AssignRoute';
import BusSummary from './BUS/BusSummary';
import AssignEmployee from './BUS/AssignEmployee';
import Income from './Finance/income';
import Expenses from './Finance/Expenses';
import FinanceSummary from './Finance/FinanceSummary';
import FinanceDashboard from './Finance/FinanceDashboard';
import Dashboard from './Customer/Dashboard';
import CustomerGallery from './Customer/CustomerGallery';
import DisplayBus from './Customer/DisplayBus';
import BookSeat from './Customer/BookSeat';
import Login from './Login/Login';
import Register from './Login/Register';
import MyProfile from './Customer/MyProfile';
import PaymentPage from './Customer/PaymentPage';
import MyBooking from './Customer/MyBooking';
import Support from './Customer/Support';
import CustomerProtectedRoute from './Customer/CustomerProtectedRoute';
import Loader from './Loader/Loader';

const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600); // Delay can be adjusted as needed

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      {loading && <Loader />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* HR Management Routes */}
        <Route path="/add-employee" element={<EmployeeRegister />} />

        {/* Bus Manager Routes */}
        <Route path="/add-bus" element={<AddBus />} />
        <Route path="/add-route" element={<AddRoute />} />
        <Route path="/Bus-dashboard" element={<BusDashboard />} />
        <Route path="/assign-route" element={<AssignRoute />} />
        <Route path="/bus-summary" element={<BusSummary />} />
        <Route path="/assign-employee" element={<AssignEmployee />} />

        {/*Finance Routes */}
        <Route path="/add-income" element={<Income />} />
        <Route path="/add-expenses" element={<Expenses />} />
        <Route path="/finance-summary" element={<FinanceSummary />} />
        <Route path="/finance-dashboard" element={<FinanceDashboard />} />

        <Route path="/" element={<Dashboard />} />
        <Route path="/customer/gallery" element={<CustomerGallery />} />
        <Route path="/customer/book-ticket" element={<DisplayBus />} />
        <Route path="/customer/support" element={<Support />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/book-seat/:id"
          element={
            <CustomerProtectedRoute>
              <BookSeat />
            </CustomerProtectedRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <CustomerProtectedRoute>
              <MyProfile />
            </CustomerProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <CustomerProtectedRoute>
              <PaymentPage />
            </CustomerProtectedRoute>
          }
        />
        <Route
          path="/customer/my-bookings"
          element={
            <CustomerProtectedRoute>
              <MyBooking />
            </CustomerProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
