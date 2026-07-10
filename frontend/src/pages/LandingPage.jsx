import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, EyeOff, Eye, LogIn, ArrowRight } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useKioskContext } from '@/context/KioskContext';
import '@/pages/home.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { booths } = useKioskContext();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState(booths[0]?.id || 'booth-01');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate slight network delay for better UX
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        login({ role: 'admin', name: 'System Admin', email: username });
        navigate('/admin');
      } else if (username === 'mod' && password === 'mod123') {
        login({ role: 'moderator', name: 'Desk Moderator', email: username });
        navigate('/mod');
      } else if (username === 'voter' && password === 'voter123') {
        login({ role: 'voter', name: 'Student Voter', email: username });
        navigate(`/vote/${selectedBooth}`);
      } else {
        setError('Invalid username or password.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="landing-container">
      <div className="glass-card login-card">
        <div className="login-header">
          <div className="logo-container">
            <img src="/logo.png" alt="School Election Logo" className="logo-img" />
            <div className="logo-glow"></div>
          </div>
          <h1 className="logo-text">
            School<span className="text-gradient">Election</span>
          </h1>
          <p className="subtitle">Centralised Authentication System</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <User size={20} className="input-icon left-icon" />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              required
              className="premium-input"
            />
          </div>

          <div className="input-group">
            <Lock size={20} className="input-icon left-icon" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              required
              className="premium-input"
            />
            <button 
              type="button"
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {error && <div className="error-text animate-shake">{error}</div>}

          <div className="form-options">
            <label className="custom-checkbox">
              <input type="checkbox" />
              <span className="checkmark"></span>
              <span className="checkbox-label">Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <LogIn size={20} /> 
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <select 
            value={selectedBooth} 
            onChange={(e) => setSelectedBooth(e.target.value)}
            className="premium-input"
            style={{ padding: '12px', borderRadius: '12px', background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem', width: '100%', appearance: 'none', cursor: 'pointer' }}
          >
            {booths && booths.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.location})</option>
            ))}
          </select>

          <button 
            className="secondary-btn launch-terminal-btn"
            onClick={() => navigate(`/vote/${selectedBooth}`)}
            type="button"
          >
            <Shield size={18} className="btn-icon" />
            <span>Launch Voting Terminal</span>
            <ArrowRight size={18} className="btn-icon-right" />
          </button>
        </div>

      </div>

      <div className="page-footer">
        © 2026 School Election System. Secure, transparent, and democratic.
      </div>
    </div>
  );
}
