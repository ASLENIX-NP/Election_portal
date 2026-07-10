import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserCheck, MonitorPlay, ShieldCheck, LogOut, History, RefreshCcw } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useElection } from '@/context/ElectionContext';

export default function ModLayout() {
  const { user, logout } = useAuthContext();
  const { electionTitle } = useElection();
  const navigate = useNavigate();

  // Protect Mod Routes (Assuming mod or admin can access)
  if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo.png" alt="School Election Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px' }} />
          <span style={{ fontSize: '1.05rem', lineHeight: '1.2', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }} title="Moderator Portal">Moderator Portal</span>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/mod" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/mod/verify" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <UserCheck size={20} />
            Verify Voters
          </NavLink>
          <NavLink to="/mod/booths" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <MonitorPlay size={20} />
            Monitor Kiosks
          </NavLink>
          <NavLink to="/mod/reset" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <RefreshCcw size={20} />
            Reset Credential
          </NavLink>
          <NavLink to="/mod/audit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <History size={20} />
            Audit Logs
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
      
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
