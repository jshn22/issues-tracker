import React, { useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setToken(null);
    setPreviewUrl(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot', { email });
      setMessage(res.data.message || 'If an account exists, a reset link was sent.');
      setPreviewUrl(res.data.previewUrl || null);
      if (res.data.token) setToken(res.data.token);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Forgot Password</h2>
        <p style={{ color: '#6b7280', marginBottom: 12 }}>Enter the email address for your account and we'll send a reset link.</p>
        {message && <div style={{ background: '#e6f4ea', padding: 10, borderRadius: 8, marginBottom: 12 }}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12, textAlign: 'left' }}>
            <label>Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending…' : 'Send Reset Email'}
          </button>
        </form>

        {previewUrl && (
          <div style={{ marginTop: 12 }}>
            <p>Email sent (dev preview):</p>
            <a href={previewUrl} target="_blank" rel="noreferrer">Open preview email</a>
          </div>
        )}

        {token && (
          <div style={{ marginTop: 12 }}>
            <p>Dev token (use on reset page):</p>
            <code style={{ display: 'block', padding: 8, background: '#f7fafc', borderRadius: 6 }}>{token}</code>
            <p style={{ marginTop: 8 }}><Link to={`/reset/${token}`}>Go to reset page</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
