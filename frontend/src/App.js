import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        {/* HR Management Routes */}
        <Route path="/" element={<EmployeeRegister />} /> {/* Default route */}
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
      </Routes>
    </Router>
  );
}

export default App;
