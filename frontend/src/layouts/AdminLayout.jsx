import { useState } from 'react';
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserSquare2, Settings, ShieldCheck, LogOut, ClipboardList, MonitorPlay, Menu, Search, Bell, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
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

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-brand">
          <img src="/logo.png" alt="School Election Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px', flexShrink: 0 }} />
          <span className="brand-text">{electionTitle || 'ElectionAdmin'}</span>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Dashboard">
            <LayoutDashboard size={20} />
            <span className="nav-text">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/ballot" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Ballot & Positions">
            <ClipboardList size={20} />
            <span className="nav-text">Ballot & Positions</span>
          </NavLink>
          <NavLink to="/admin/candidates" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Manage Candidates">
            <UserSquare2 size={20} />
            <span className="nav-text">Manage Candidates</span>
          </NavLink>
          <NavLink to="/admin/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Manage Voters">
            <Users size={20} />
            <span className="nav-text">Manage Voters</span>
          </NavLink>
          <NavLink to="/admin/moderators" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Manage Moderators">
            <ShieldCheck size={20} />
            <span className="nav-text">Manage Moderators</span>
          </NavLink>
          <NavLink to="/admin/booths" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Manage Booths">
            <MonitorPlay size={20} />
            <span className="nav-text">Manage Booths</span>
          </NavLink>
          <NavLink to="/admin/audit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Audit Ledger">
            <FileText size={20} />
            <span className="nav-text">Audit Ledger</span>
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Election Settings">
            <Settings size={20} />
            <span className="nav-text">Election Settings</span>
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            style={{ width: '100%', justifyContent: 'center' }}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> <span className="nav-text">Collapse</span></>}
          </button>
          
          <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }} title="Sign Out">
            <LogOut size={18} />
            <span className="nav-text">Sign Out</span>
          </button>
        </div>
      </aside>
      
      <div className="admin-content-wrapper">
        <header className="global-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '400px', width: '100%', background: 'var(--surface-hover)', borderRadius: '8px' }}>
              <Search size={18} color="var(--text-secondary)" />
              <input 
                type="text" 
                placeholder="Search candidates, voters, settings..." 
                style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem' }} 
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%', border: 'none', background: 'transparent' }} title="Notifications">
              <div style={{ position: 'relative' }}>
                <Bell size={20} color="var(--text-primary)" />
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></span>
              </div>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid var(--border-color)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                A
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>System Admin</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>admin@school.edu</span>
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
