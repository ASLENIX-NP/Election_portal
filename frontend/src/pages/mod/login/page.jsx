import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { Users, Lock, User as UserIcon, ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function ModLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/mod/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        navigate('/mod');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Error connecting to the server. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      
      {/* Very Subtle Background Glows for Depth on White */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(167,139,250,0.03) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <button 
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#64748b', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: 600, zIndex: 20 }}
        onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
      >
        <ArrowLeft size={18} /> <span>Back</span>
      </button>

      <div style={{ width: '100%', maxWidth: '440px', zIndex: 1, animation: 'fadeUp 0.8s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: '#f5f3ff', border: '1px solid #ddd6fe', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.1)' }}>
            <Users size={40} color="#8b5cf6" />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', color: '#0f172a' }}>
            Moderator Desk
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Verify voter identity and authorize sessions</p>
        </div>
        
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05), 0 0 20px rgba(0,0,0,0.02)' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.95rem', justifyContent: 'center', fontWeight: 600, background: 'rgba(239,68,68,0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', animation: 'fadeUp 0.3s ease-out' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="form-group" style={{ position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontSize: '0.95rem', fontWeight: 600 }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '48px', height: '56px', fontSize: '1.05rem', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', transition: 'all 0.3s ease', width: '100%', outline: 'none' }} 
                  placeholder="mod" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                  onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
              </div>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.95rem', fontWeight: 600 }}>
                  Password
                </label>
                <Link to="/mod/forgot-password" style={{ fontSize: '0.85rem', color: '#8b5cf6', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#6d28d9'} onMouseOut={e => e.target.style.color = '#8b5cf6'}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  className="form-control" 
                  style={{ paddingLeft: '48px', height: '56px', fontSize: '1.05rem', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', letterSpacing: '0.1em', transition: 'all 0.3s ease', width: '100%', outline: 'none' }} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary" 
              style={{ width: '100%', height: '56px', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 700, borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: 'white', border: 'none', boxShadow: '0 10px 25px rgba(139,92,246,0.25)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease', cursor: isLoading ? 'not-allowed' : 'pointer' }}
              onMouseOver={(e) => { if(!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(139,92,246,0.35)'; } }}
              onMouseOut={(e) => { if(!isLoading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(139,92,246,0.25)'; } }}
            >
              {isLoading ? <span className="spinner" style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span> : <>Authorize Desk <ChevronRight size={20} /></>}
            </button>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f5f3ff', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 10px #8b5cf6' }}></span>
                Hint: Use <strong style={{ color: '#0f172a' }}>mod</strong> / <strong style={{ color: '#0f172a' }}>mod123</strong>
              </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/mod/signup" style={{ fontSize: '0.9rem', color: '#8b5cf6', textDecoration: 'none', fontWeight: 600 }}>
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
