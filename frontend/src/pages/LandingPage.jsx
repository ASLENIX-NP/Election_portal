import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Vote, ChevronRight } from 'lucide-react';
import '@/pages/home.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      
      <div className="login-header" style={{ marginBottom: '3rem', textAlign: 'center', animation: 'slideDown 0.8s ease-out' }}>
        <div className="logo-container" style={{ margin: '0 auto 1.5rem' }}>
          <img src="/logo.png" alt="School Election Logo" className="logo-img" />
          <div className="logo-glow"></div>
        </div>
        <h1 className="logo-text" style={{ fontSize: '3rem' }}>
          School<span className="text-gradient">Election</span>
        </h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>Select your portal to continue</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px', zIndex: 1, animation: 'fadeUp 0.8s ease-out 0.2s backwards' }}>
        
        {/* Admin Card */}
        <div 
          onClick={() => navigate('/admin/login')}
          className="glass-card role-card" 
          style={{ cursor: 'pointer', padding: '2.5rem', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(59,130,246,0.2)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
        >
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Shield size={48} color="#3b82f6" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>Manage the entire election system, candidates, and global settings.</p>
          <div style={{ display: 'flex', alignItems: 'center', color: '#3b82f6', fontWeight: 600, gap: '0.5rem' }}>
            Enter Portal <ChevronRight size={18} />
          </div>
        </div>

        {/* Moderator Card */}
        <div 
          onClick={() => navigate('/mod/login')}
          className="glass-card role-card" 
          style={{ cursor: 'pointer', padding: '2.5rem', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(168,85,247,0.2)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
        >
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Users size={48} color="#a855f7" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Moderator Desk</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>Verify students and authorize active voting sessions at your booth.</p>
          <div style={{ display: 'flex', alignItems: 'center', color: '#a855f7', fontWeight: 600, gap: '0.5rem' }}>
            Enter Desk <ChevronRight size={18} />
          </div>
        </div>

        {/* Voter Card */}
        <div 
          onClick={() => navigate('/voter/login')}
          className="glass-card role-card" 
          style={{ cursor: 'pointer', padding: '2.5rem', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(16,185,129,0.2)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
        >
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Vote size={48} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Voting Kiosk</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>Cast your secure ballot after verification from a moderator.</p>
          <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: 600, gap: '0.5rem' }}>
            Enter Kiosk <ChevronRight size={18} />
          </div>
        </div>

      </div>

      <div className="page-footer" style={{ marginTop: '4rem' }}>
        © 2026 School Election System. Secure, transparent, and democratic.
      </div>
    </div>
  );
}
