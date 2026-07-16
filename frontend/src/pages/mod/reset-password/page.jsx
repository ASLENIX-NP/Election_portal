import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import '../../auth.css';

export default function ModResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`/api/auth/mod/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <div className="login-header">
            <div className="login-logo-badge" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', margin: '0 auto 20px auto' }}>
              <Lock size={24} color="#059669" />
            </div>
            <h1 className="login-title">Password Reset!</h1>
            <p className="login-subtitle" style={{ marginBottom: '20px' }}>Your moderator password has been successfully updated.</p>
          </div>
          <Link to="/mod" className="login-submit-btn" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            Go to Mod Desk <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-badge" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Lock size={24} color="#64748b" />
          </div>
          <h1 className="login-title">Create New Password</h1>
          <p className="login-subtitle">Enter a new secure password for your mod account</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
