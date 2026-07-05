import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, User, ChevronRight } from 'lucide-react';
import './home.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const loginOptions = [
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Manage the election system, candidates, and system settings.',
      icon: <Shield size={32} className="option-icon admin-icon" />,
      path: '/admin/login',
      colorClass: 'admin-card'
    },
    {
      id: 'moderator',
      title: 'Moderator',
      description: 'Monitor election progress and manage voter inquiries.',
      icon: <Users size={32} className="option-icon mod-icon" />,
      path: '/mod',
      colorClass: 'mod-card'
    },
    {
      id: 'voter',
      title: 'Voter',
      description: 'Cast your vote and participate in the ongoing election.',
      icon: <User size={32} className="option-icon voter-icon" />,
      path: '/vote',
      colorClass: 'voter-card'
    }
  ];

  return (
    <div className="landing-container">
      <div className="landing-background">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>
      
      <div className="landing-content">
        <header className="landing-header">
          <div className="logo-wrapper">
            <Shield className="logo-icon" size={40} />
          </div>
          <h1>School Election Portal</h1>
          <p>Select your role to securely access the system</p>
        </header>

        <div className="login-options-grid">
          {loginOptions.map((option) => (
            <div 
              key={option.id} 
              className={`login-card glass-panel ${option.colorClass}`}
              onClick={() => navigate(option.path)}
            >
              <div className="card-content">
                <div className="icon-wrapper">
                  {option.icon}
                </div>
                <h2>{option.title}</h2>
                <p>{option.description}</p>
              </div>
              <div className="card-footer">
                <span>Continue as {option.title}</span>
                <ChevronRight size={20} className="arrow-icon" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
