import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { label: 'Projects', icon: <FolderKanban size={18} />, path: '/projects' },
    { label: 'Tasks', icon: <CheckSquare size={18} />, path: '/tasks' },
    ...(user?.role === 'admin' ? [{ label: 'Team', icon: <Users size={18} />, path: '/team' }] : []),
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">Task<span>Flow</span></div>
      <nav style={{ flex: 1 }}>
        {navItems.map(item => (
          <button key={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
      <div className="nav-bottom">
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{user?.email}</div>
          <span className={`badge badge-${user?.role}`} style={{ marginTop: 6, display: 'inline-block' }}>{user?.role}</span>
        </div>
        <button className="nav-item" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
