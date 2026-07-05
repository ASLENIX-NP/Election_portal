import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserSquare2, Settings, ShieldCheck, LogOut, ClipboardList } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

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
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <ShieldCheck className="icon" size={28} />
          <span>ElectionAdmin</span>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/ballot" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <ClipboardList size={20} />
            Ballot & Positions
          </NavLink>
          <NavLink to="/admin/candidates" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <UserSquare2 size={20} />
            Manage Candidates
          </NavLink>
          <NavLink to="/admin/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            Manage Students
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            Election Settings
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
