import React from 'react';
import SideBarBus from '../BUSComponent/SideBarBus';
import TopHeader from '../HRComponents/TopHeader';

const AssignEmployee = () => {
  const sampleData = [
    { id: 1, busNumber: 'ND-6229', permit: 'PMR001' },
    { id: 2, busNumber: 'ND-6229', permit: 'PMR001' },
    { id: 3, busNumber: 'ND-6229', permit: 'PMR001' }
  ];

  return (
    <div className="employeeRegister">
      <TopHeader />
      <div className="main-container">
        <SideBarBus />
        <div className="flex-grow-1 p-4">
          {/* Header buttons */}
          <div className="d-flex justify-content-end align-items-center gap-3 mb-4 flex-wrap">
            <button className="btn btn-light d-flex align-items-center px-3 shadow-sm">
              <i className="fas fa-sliders-h me-2"></i>
              Assigned Bus
            </button>

            <div className="input-group" style={{ maxWidth: '240px' }}>
              <span className="input-group-text bg-light border-end-0">
                <i className="fas fa-search text-dark"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search Bus"
              />
            </div>
          </div>

          {/* Section Title */}
          <h4 className="employee-title mb-3">Assign Employees</h4>

          {/* Table */}
          <div className="employee-table-wrapper">
  <table className="employee-table">
    <thead>
      <tr>
        <th>Image</th>
        <th>Bus Number</th>
        <th>Permit Number</th>
        <th>Assign Driver</th>
        <th>Assign Conductor</th>
        <th>Assign Garage</th>
      </tr>
    </thead>
    <tbody className="employee-scrollable-body">
      {sampleData.map((bus, index) => (
        <tr key={index}>
          <td>
            <img
              src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
              alt="avatar"
              className="employee-avatar"
            />
          </td>
          <td>{bus.busNumber}</td>
          <td>{bus.permit}</td>
          <td><button className="assign-btn">Assign</button></td>
          <td><button className="assign-btn">Assign</button></td>
          <td><button className="assign-btn">Assign</button></td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </div>
      </div>
    </div>
  );
};

export default AssignEmployee;
