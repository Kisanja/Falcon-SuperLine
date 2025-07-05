import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/bus-back.jpg';
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const validate = (field, value) => {
    let err = '';

    switch (field) {
      case 'name':
        if (/\d/.test(value)) err = 'Name cannot contain numbers';
        break;
      case 'password':
        if (value.length < 7) err = 'Password must be at least 7 characters';
        break;
      case 'confirmPassword':
        if (value !== formData.password) err = 'Passwords do not match';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);

    // Also validate confirmPassword again if password changes
    if (name === 'password') validate('confirmPassword', formData.confirmPassword);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  for (const key in formData) validate(key, formData[key]);
  if (Object.values(errors).some(Boolean)) return;

  try {
    await axios.post('http://localhost:5000/api/customers/register/url', formData);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      navigate('/login');
    }, 2000);
  } catch (err) {
    alert(err.response?.data?.message || 'Registration failed');
  }
};



  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%', borderRadius: '12px' }}>
        <h3 className="text-center mb-4 fw-bold" style={{ color: '#1c1c2c' }}>Customer Registration</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-control rounded-pill ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control rounded-pill"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control rounded-pill"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              className="form-control rounded-pill"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control rounded-pill ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control rounded-pill ${errors.confirmPassword ? 'is-invalid' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-pill"
            style={{
              backgroundColor: '#1c1c2c',
              color: '#fff',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#2e2e45')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#1c1c2c')}
          >
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#1c1c2c' }}>
            Login here
          </Link>
        </div>
      </div>
   {success && (
  <div className="success-popup-overlay">
    <div className="success-popup-box">
      Registration successful ✅
    </div>
  </div>
)}

    </div>
  );
};

export default Register;
