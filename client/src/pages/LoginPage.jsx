import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 6 }}>
            <svg className="auth-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="64" height="64" rx="12" fill="#eaf3ff" />
              <path d="M22 34h20" stroke="#1976d2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32 24v20" stroke="#1976d2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p style={{ color: '#6b7280', marginBottom: 18 }}>Please log in to your account.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Log In</button>
        </form>
        <p className="auth-switch" style={{ marginTop: 12 }}>
          <Link to="/forgot">Forgot password?</Link>
        </p>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
