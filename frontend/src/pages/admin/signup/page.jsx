import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowLeft, ChevronRight, AlertCircle, User as UserIcon, UserPlus } from 'lucide-react';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data));
        navigate('/admin');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Could not connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem 1rem', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      
      {/* Very Subtle Background Glows for Depth on White */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.03) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <button 
        onClick={() => navigate('/admin/login')}
        style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#64748b', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: 600, zIndex: 20 }}
        onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
      >
        <ArrowLeft size={18} /> <span>Back to Login</span>
      </button>

      <div style={{ width: '100%', maxWidth: '440px', zIndex: 1, animation: 'fadeUp 0.8s ease-out', marginTop: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', borderRadius: '20px', background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: '1rem', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.1)' }}>
            <UserPlus size={32} color="#3b82f6" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', color: '#0f172a' }}>
            Create Admin Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>Register to manage the school election system</p>
        </div>
        
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05), 0 0 20px rgba(0,0,0,0.02)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.95rem', justifyContent: 'center', fontWeight: 600, background: 'rgba(239,68,68,0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', animation: 'fadeUp 0.3s ease-out' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="form-group" style={{ position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  style={{ paddingLeft: '44px', height: '52px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', transition: 'all 0.3s ease', width: '100%', outline: 'none' }} 
                  placeholder="e.g. Jane Doe" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required 
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
              </div>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  style={{ paddingLeft: '44px', height: '52px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', transition: 'all 0.3s ease', width: '100%', outline: 'none' }} 
                  placeholder="jane@school.edu" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
              </div>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  style={{ paddingLeft: '44px', height: '52px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', transition: 'all 0.3s ease', width: '100%', outline: 'none' }} 
                  placeholder="admin" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required 
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
              </div>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  style={{ paddingLeft: '44px', height: '52px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', letterSpacing: '0.1em', transition: 'all 0.3s ease', width: '100%', outline: 'none' }} 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ width: '100%', height: '52px', marginTop: '0.5rem', fontSize: '1.05rem', fontWeight: 700, borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', boxShadow: '0 10px 25px rgba(37,99,235,0.25)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease', cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseOver={(e) => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(37,99,235,0.35)'; } }}
              onMouseOut={(e) => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(37,99,235,0.25)'; } }}
            >
              {loading ? <span className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span> : <>Complete Signup <ChevronRight size={18} /></>}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/admin/login" style={{ fontSize: '0.9rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
                Already have an account? Sign in
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
