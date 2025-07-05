import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/image-register.jpg';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/customers/login', {
        login,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.customer));

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px' }}>
        <h3 className="text-center mb-4 fw-bold" style={{ color: '#1c1c2c' }}>Customer Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username or Email</label>
            <input
              type="text"
              className="form-control rounded-pill"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-pill"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: '#1c1c2c' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
