import { useState } from 'react';
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserCheck, MonitorPlay, LogOut, History, RefreshCcw, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

export default function ModLayout() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Protect Mod Routes (Assuming mod or admin can access)
  if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-brand">
          <img src="/logo.png" alt="School Election Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px', flexShrink: 0 }} />
          <span className="brand-text">Moderator Portal</span>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/mod" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Dashboard">
            <LayoutDashboard size={20} />
            <span className="nav-text">Dashboard</span>
          </NavLink>
          <NavLink to="/mod/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Manage Voters">
            <Users size={20} />
            <span className="nav-text">Manage Voters</span>
          </NavLink>
          <NavLink to="/mod/verify" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Verify Voters">
            <UserCheck size={20} />
            <span className="nav-text">Verify Voters</span>
          </NavLink>
          <NavLink to="/mod/booths" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Monitor Kiosks">
            <MonitorPlay size={20} />
            <span className="nav-text">Monitor Kiosks</span>
          </NavLink>
          <NavLink to="/mod/reset" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Reset Credential">
            <RefreshCcw size={20} />
            <span className="nav-text">Reset Credential</span>
          </NavLink>
          <NavLink to="/mod/audit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Audit Logs">
            <History size={20} />
            <span className="nav-text">Audit Logs</span>
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
