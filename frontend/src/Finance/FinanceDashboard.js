import React, { useEffect, useState } from 'react';
import TopHeader from '../HRComponents/TopHeader';
import SideBarFinance from '../FinanceComponent/SideBarFinance';
import { FaCalendarAlt, FaDownload, FaBell } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ArcElement);

const FinanceDashboard = () => {
  const [visibleData, setVisibleData] = useState('both');
  const [incomeByYear, setIncomeByYear] = useState([]);
  const [expensesByYear, setExpensesByYear] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [groupBy, setGroupBy] = useState('year'); // 'year' or 'month'

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/finance/summary?groupBy=${groupBy}`)
      .then((res) => {
        setExpensesByYear(res.data.expensesByYear || []);
        setIncomeByYear(res.data.incomeByYear || []);
        setTotalIncome(res.data.totalIncome || 0);
        setTotalExpenses(res.data.totalExpenses || 0);
      })
      .catch((err) => {
        console.error('Error fetching finance summary:', err);
      });
  }, [groupBy]);

  // Extract all years/months
  const allLabelsSet = new Set([
    ...incomeByYear.map((d) => d.year),
    ...expensesByYear.map((d) => d.year),
  ]);
  const allLabels = Array.from(allLabelsSet).sort();

  const incomeMap = Object.fromEntries(incomeByYear.map((d) => [d.year, d.amount]));
  const expensesMap = Object.fromEntries(expensesByYear.map((d) => [d.year, d.amount]));

  const incomeData = allLabels.map((label) => incomeMap[label] || 0);
  const expenseData = allLabels.map((label) => expensesMap[label] || 0);

  const datasets = [];

  if (visibleData === 'income' || visibleData === 'both') {
    datasets.push({
      label: 'Income',
      data: incomeData,
      borderColor: '#28a745',
      backgroundColor: '#28a745',
      tension: 0.3,
      fill: false,
    });
  }

  if (visibleData === 'expenses' || visibleData === 'both') {
    datasets.push({
      label: 'Expenses',
      data: expenseData,
      borderColor: '#dc3545',
      backgroundColor: '#dc3545',
      tension: 0.3,
      fill: false,
    });
  }

  const chartData = {
    labels: allLabels,
    datasets,
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${(value / 1000).toFixed(0)}K`,
        },
      },
    },
  };

  const doughnutData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ['#28a745', '#dc3545'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
        },
      },
    },
  };

  const totalBudget = totalIncome - totalExpenses;

  return (
    <div className="employeeRegister">
      <TopHeader />
      <div className="main-container d-flex">
        <SideBarFinance />
        <div className="flex-grow-1 p-4">

          {/* 🔘 Top Controls */}
          <div className="d-flex justify-content-end align-items-center gap-3 flex-wrap mb-4">
            <div className="d-flex gap-2 align-items-center">
              <FaCalendarAlt className="me-2 text-dark" />
              <select
                className="form-select form-select-sm w-auto"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                style={{ minWidth: '130px', height: '44px' }}
              >
                <option value="year">Yearly</option>
                <option value="month">Monthly</option>
              </select>
            </div>

            <select
              className="form-select form-select-sm w-auto"
              style={{ minWidth: '150px', height: '44px' }}
              value={visibleData}
              onChange={(e) => setVisibleData(e.target.value)}
            >
              <option value="both">Show Both</option>
              <option value="income">Only Income</option>
              <option value="expenses">Only Expenses</option>
            </select>
            <div
              className="bg-dark d-flex align-items-center justify-content-center rounded-3"
              style={{ width: 44, height: 44 }}
            >
              <FaBell style={{ color: 'white', fontSize: '18px' }} />
            </div>
          </div><br/>

          {/* 🔹 Charts Row */}
          <div className="d-flex flex-wrap justify-content-center align-items-start gap-4 mb-5">
            {/* 📈 Line Chart */}
            <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
  <h6 className="text-center mb-3">📈 Income vs Expenses</h6>
  <Line data={chartData} options={lineOptions} />
</div>


            {/* 🍩 Doughnut Chart */}
            <div style={{ flex: '0 1 200px', maxWidth: '250px' }}>
  <h6 className="text-center mb-3">🍩 Overall Comparison</h6>
  <Doughnut data={doughnutData} options={doughnutOptions} />
</div>

          </div>

          {/* 🔹 Summary Boxes */}
          <div className="d-flex justify-content-center gap-4 mb-4 flex-wrap">
            <div
              className="bg-white border shadow-sm rounded-4 px-5 py-4 text-center"
              style={{ borderColor: '#28a745', color: '#28a745' }}
            >
              <div className="fw-bold fs-3">{totalIncome.toLocaleString()}</div>
              <div>Total Income</div>
            </div>
            <div
              className="bg-white border shadow-sm rounded-4 px-5 py-4 text-center"
              style={{ borderColor: '#dc3545', color: '#dc3545' }}
            >
              <div className="fw-bold fs-3">{totalExpenses.toLocaleString()}</div>
              <div>Total Expenses</div>
            </div>
            <div
              className="bg-white border shadow-sm rounded-4 px-5 py-4 text-center"
              style={{ borderColor: 'dark', color: 'dark' }}
            >
              <div className="fw-bold fs-3">{totalBudget.toLocaleString()}</div>
              <div>Total Budget</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
