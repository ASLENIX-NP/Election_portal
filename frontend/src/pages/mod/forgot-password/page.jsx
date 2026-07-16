import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import '../../auth.css';

export default function ModForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/mod/forgot-password', { email });
      setMessage(response.data.message || 'If that email is in our system, a reset link has been generated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-badge" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Lock size={24} color="#64748b" />
          </div>
          <h1 className="login-title">Moderator Password Reset</h1>
          <p className="login-subtitle">Enter your email to receive a reset link</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}
        {message && <div className="login-success-alert" style={{ background: '#ecfdf5', color: '#059669', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>{message}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mod@school.edu"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer">
          <Link to="/mod" className="forgot-password-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Back to Mod Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
