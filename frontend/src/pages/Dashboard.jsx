import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Clock, AlertCircle, FolderKanban, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    API.get('/dashboard').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'var(--muted)', padding: 40 }}>Loading dashboard...</div>;

  const stats = user?.role === 'admin' ? [
    { label: 'Total Projects', value: data?.totalProjects ?? 0, icon: <FolderKanban size={22} />, color: '#6366f1' },
    { label: 'Total Tasks', value: data?.totalTasks ?? 0, icon: <CheckSquare size={22} />, color: '#22c55e' },
    { label: 'Team Members', value: data?.totalUsers ?? 0, icon: <Users size={22} />, color: '#f59e0b' },
    { label: 'Overdue', value: data?.overdue ?? 0, icon: <AlertCircle size={22} />, color: '#ef4444' },
  ] : [
    { label: 'My Tasks', value: data?.totalTasks ?? 0, icon: <CheckSquare size={22} />, color: '#6366f1' },
    { label: 'In Progress', value: data?.inProgress ?? 0, icon: <TrendingUp size={22} />, color: '#f59e0b' },
    { label: 'Completed', value: data?.done ?? 0, icon: <CheckSquare size={22} />, color: '#22c55e' },
    { label: 'Overdue', value: data?.overdue ?? 0, icon: <AlertCircle size={22} />, color: '#ef4444' },
  ];

  const now = new Date();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">👋 Welcome back, {user?.name?.split(' ')[0]}!</div>
          <div className="page-sub">Here's what's happening on your workspace today.</div>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div style={{ color: s.color }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={18} color="var(--primary)" /> Recent Tasks
        </div>
        {data?.recentTasks?.length === 0 && (
          <div className="empty-state"><div>No tasks yet.</div></div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data?.recentTasks?.map(task => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < now && task.status !== 'done';
            return (
              <div className="task-card" key={task._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="task-title">{task.title}</div>
                  <span className={`badge badge-${task.status}`}>{task.status}</span>
                </div>
                <div className="task-meta">
                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                  {task.project && <span style={{ fontSize: 12, color: 'var(--muted)' }}>📁 {task.project.name}</span>}
                  {task.assignedTo && <span style={{ fontSize: 12, color: 'var(--muted)' }}>👤 {task.assignedTo.name}</span>}
                  {task.dueDate && (
                    <span className={isOverdue ? 'overdue' : ''} style={{ fontSize: 12 }}>
                      {isOverdue ? '⚠️ Overdue: ' : '📅 '}{new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
