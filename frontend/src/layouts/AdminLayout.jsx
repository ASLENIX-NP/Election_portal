import { useState } from 'react';
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserSquare2, Settings, ShieldCheck, LogOut, ClipboardList, MonitorPlay, Search, Bell, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useElection } from '@/context/ElectionContext';

export default function AdminLayout() {
  const { user, logout } = useAuthContext();
  const { electionTitle } = useElection();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Protect Admin Routes
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', end: true, icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/ballot', icon: ClipboardList, label: 'Ballot & Candidates' },
    { to: '/admin/students', icon: Users, label: 'Voter Registry' },
    { to: '/admin/moderators', icon: ShieldCheck, label: 'Moderators' },
    { to: '/admin/booths', icon: MonitorPlay, label: 'Polling Booths' },
    { to: '/admin/audit', icon: FileText, label: 'Audit Trail' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        
        {/* Brand */}
        <div className="admin-brand">
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '8px', 
            background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            flexShrink: 0
          }}>
            <ShieldCheck size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="brand-text" style={{ fontSize: '0.95rem' }}>
            {electionTitle || 'Election Admin'}
          </span>
        </div>
        
        {/* Navigation */}
        <nav className="admin-nav">
          <p style={{ 
            fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', 
            textTransform: 'uppercase', letterSpacing: '0.08em', 
            padding: '0 12px', marginBottom: '4px',
            display: isSidebarCollapsed ? 'none' : 'block' 
          }}>
            Menu
          </p>
          {navItems.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.end} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
              title={item.label}
            >
              <item.icon size={18} strokeWidth={1.8} />
              <span className="nav-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '7px' }}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> <span className="nav-text">Collapse</span></>}
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={handleLogout} 
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '7px', color: '#94a3b8' }} 
            title="Sign Out"
          >
            <LogOut size={16} />
            <span className="nav-text">Sign Out</span>
          </button>
        </div>
      </aside>
      
      <div className="admin-content-wrapper">
        {/* Compact Header */}
        <header className="global-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              maxWidth: '320px', width: '100%', 
              background: '#f5f6f8', borderRadius: '8px', padding: '0 12px',
              border: '1px solid transparent', transition: 'border-color 0.15s ease'
            }}>
              <Search size={15} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ 
                  background: 'transparent', border: 'none', outline: 'none', 
                  width: '100%', color: 'var(--text-primary)', 
                  fontSize: '0.825rem', padding: '8px 0', fontFamily: 'inherit' 
                }} 
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ 
              background: 'transparent', border: 'none', cursor: 'pointer', 
              padding: '6px', borderRadius: '6px', display: 'flex', position: 'relative',
              transition: 'background 0.15s ease'
            }}>
              <Bell size={18} color="#64748b" />
              <span style={{ 
                position: 'absolute', top: '4px', right: '4px', 
                width: '6px', height: '6px', 
                background: '#dc2626', borderRadius: '50%', border: '1.5px solid #fff' 
              }}></span>
            </button>
            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '30px', height: '30px', borderRadius: '8px', 
                background: '#2563eb', color: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 600, fontSize: '0.75rem' 
              }}>
                A
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Admin</span>
                <span style={{ fontSize: '0.675rem', color: '#94a3b8' }}>admin@school.edu</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
