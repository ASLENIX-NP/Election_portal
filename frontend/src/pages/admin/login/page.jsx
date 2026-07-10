import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/common/Card';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock authentication
    if (email === 'admin' && password === 'admin123') {
      login({ role: 'admin', name: 'System Admin', email });
      navigate('/admin');
    } else {
      alert('Invalid credentials. Please use admin / admin123');
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', overflow: 'hidden' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <button 
        onClick={() => navigate('/')}
        className="btn btn-secondary"
        style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div style={{ width: '100%', maxWidth: '420px', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', animation: 'slideDown 0.8s ease-out' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)' }}>
            <ShieldCheck size={40} color="#3b82f6" style={{ filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.5))' }} />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff 0%, #6ee7b7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Securely manage the election system</p>
        </div>
        
        <div style={{ animation: 'fadeUp 0.8s ease-out 0.2s backwards' }}>
          <Card>
            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ paddingLeft: '48px', height: '52px', fontSize: '1rem' }} 
                    placeholder="admin" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group" style={{ position: 'relative', marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="password" 
                    className="form-control" 
                    style={{ paddingLeft: '48px', height: '52px', fontSize: '1rem', letterSpacing: '0.1em' }} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', height: '52px', fontSize: '1rem', fontWeight: 600, boxShadow: '0 4px 20px rgba(59,130,246,0.3)', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(59,130,246,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.3)'; }}
              >
                Secure Login
              </button>
              
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }}></span>
                  Hint: Use admin / admin123
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
