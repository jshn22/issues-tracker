import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post(`/auth/reset/${token}`, { password });
      setMessage(res.data.message || 'Password reset successful');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Reset Password</h2>
        {message && <div className="alert">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
