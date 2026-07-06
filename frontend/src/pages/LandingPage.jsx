import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, User, Lock, Mail, KeyRound, LogIn, ShieldCheck, EyeOff } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useKioskContext } from '@/context/KioskContext';
import '@/pages/home.css';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('admin');
  const navigate = useNavigate();

  // Voter State
  const { authenticateVoter } = useKioskContext();
  const [studentId, setStudentId] = useState('');
  const [voterError, setVoterError] = useState('');

  // Admin State
  const { login } = useAuthContext();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleVoterLogin = (e) => {
    e.preventDefault();
    if (authenticateVoter(studentId.toUpperCase())) {
      setVoterError('');
      navigate('/vote/ballot');
    } else {
      setVoterError('Invalid Student ID.');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail === 'admin' && adminPassword === 'admin123') {
      login({ role: 'admin', name: 'System Admin', email: adminEmail });
      navigate('/admin');
    } else {
      setAdminError('Invalid credentials.');
    }
  };

  return (
    <div className="landing-container">
      {/* Abstract Background Elements */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      <div className="bg-shape bg-shape-3"></div>
      
      <div className="login-card">
        
        {/* Header Section */}
        <div className="login-header">
          <div className="logo-icon-wrapper">
            <Shield size={42} strokeWidth={2} />
            <div className="logo-inner-keyhole"></div>
          </div>
          <h1 className="logo-text">
            <span>School</span><span className="text-blue">Election</span>
          </h1>
          <p className="subtitle">Secure Access Portal</p>
        </div>

        <div className="divider-text">
          <span>Login to your account</span>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <ShieldCheck size={18} /> Administrator
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'mod' ? 'active' : ''}`}
            onClick={() => setActiveTab('mod')}
          >
            <Users size={18} /> Moderator
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'voter' ? 'active' : ''}`}
            onClick={() => setActiveTab('voter')}
          >
            <User size={18} /> Voter
          </button>
        </div>

        {/* Forms */}
        <div className="form-container">
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin}>
              <div className="input-group">
                <User size={20} className="input-icon left-icon" />
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={adminEmail}
                  onChange={(e) => { setAdminEmail(e.target.value); setAdminError(''); }}
                  required
                />
              </div>

              <div className="input-group">
                <Lock size={20} className="input-icon left-icon" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={adminPassword}
                  onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }}
                  required
                />
                <EyeOff size={20} className="input-icon right-icon" />
              </div>

              {adminError && <div className="error-text">{adminError}</div>}

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="primary-btn">
                <LogIn size={20} /> Login
              </button>
            </form>
          )}

          {activeTab === 'voter' && (
            <form onSubmit={handleVoterLogin}>
              <div className="input-group">
                <KeyRound size={20} className="input-icon left-icon" />
                <input 
                  type="text" 
                  placeholder="Student ID (e.g. S-1001)" 
                  value={studentId}
                  onChange={(e) => { setStudentId(e.target.value); setVoterError(''); }}
                  required
                  className="uppercase-input"
                />
              </div>

              {voterError && <div className="error-text">{voterError}</div>}

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
              </div>

              <button type="submit" className="primary-btn">
                <LogIn size={20} /> Authenticate & Vote
              </button>
            </form>
          )}

          {activeTab === 'mod' && (
            <div className="mod-placeholder">
              <div className="input-group">
                <Mail size={20} className="input-icon left-icon" />
                <input type="text" placeholder="Moderator Email" disabled />
              </div>
              <div className="input-group">
                <Lock size={20} className="input-icon left-icon" />
                <input type="password" placeholder="Password" disabled />
              </div>
              
              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" disabled />
                  <span className="checkmark disabled"></span>
                  Remember me
                </label>
              </div>

              <button type="button" className="primary-btn" onClick={() => navigate('/mod')}>
                <LogIn size={20} /> Continue to Portal
              </button>
            </div>
          )}
        </div>

        <div className="divider-text">
          <span>OR</span>
        </div>

        <div className="footer-links">
          <span>Secure</span>
          <span className="dot">•</span>
          <span>Transparent</span>
          <span className="dot">•</span>
          <span>Democratic</span>
        </div>
      </div>

      <div className="page-footer">
        © 2026 School Election System. All rights reserved.
      </div>
    </div>
  );
}
