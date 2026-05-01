import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, CheckSquare } from 'lucide-react';

const STATUSES = ['todo', 'in-progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

function TaskModal({ task, projects, users, onClose, onSaved }) {
  const [form, setForm] = useState(task ? {
    title: task.title, description: task.description, project: task.project?._id || '',
    assignedTo: task.assignedTo?._id || '', status: task.status, priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.substring(0, 10) : ''
  } : { title: '', description: '', project: '', assignedTo: '', status: 'todo', priority: 'medium', dueDate: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (task) {
        await API.put(`/tasks/${task._id}`, form);
        toast.success('Task updated!');
      } else {
        await API.post('/tasks', form);
        toast.success('Task created!');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{task ? 'Edit Task' : 'New Task'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Task title" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="input" style={{ resize: 'vertical', minHeight: 72 }}
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Details..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Project *</label>
              <select className="input" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} required>
                <option value="">Select project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Assign To</label>
              <select className="input" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input className="input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : task ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '', project: '' });
  const { user } = useAuth();
  const now = new Date();

  const fetchData = async () => {
    const [t, p, u] = await Promise.all([API.get('/tasks'), API.get('/projects'), API.get('/users')]);
    setTasks(t.data);
    setProjects(p.data);
    setUsers(u.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchData();
    } catch { toast.error('Error'); }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await API.put(`/tasks/${task._id}`, { status });
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const filtered = tasks.filter(t =>
    (!filter.status || t.status === filter.status) &&
    (!filter.priority || t.priority === filter.priority) &&
    (!filter.project || t.project?._id === filter.project)
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tasks</div>
          <div className="page-sub">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</div>
        </div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => { setEditTask(null); setShowModal(true); }}>
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select className="input" style={{ width: 'auto' }} value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input" style={{ width: 'auto' }} value={filter.priority} onChange={e => setFilter({ ...filter, priority: e.target.value })}>
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="input" style={{ width: 'auto' }} value={filter.project} onChange={e => setFilter({ ...filter, project: e.target.value })}>
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <CheckSquare size={48} />
          <div style={{ marginTop: 12, fontWeight: 600 }}>No tasks found</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(task => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < now && task.status !== 'done';
            return (
              <div className="task-card" key={task._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div className="task-title">{task.title}</div>
                    {task.description && <div className="task-desc">{task.description}</div>}
                    <div className="task-meta">
                      <span className={`badge badge-${task.status}`}>{task.status}</span>
                      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                      {task.project && <span style={{ fontSize: 12, color: 'var(--muted)' }}>📁 {task.project.name}</span>}
                      {task.assignedTo && <span style={{ fontSize: 12, color: 'var(--muted)' }}>👤 {task.assignedTo.name}</span>}
                      {task.dueDate && (
                        <span className={isOverdue ? 'overdue' : ''} style={{ fontSize: 12 }}>
                          {isOverdue ? '⚠️ Overdue · ' : '📅 '}{new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    {/* Quick status update for members */}
                    {user?.role === 'member' && task.assignedTo?._id === user?.id && (
                      <select className="input" style={{ width: 'auto', fontSize: 12, padding: '4px 8px' }}
                        value={task.status} onChange={e => handleStatusChange(task, e.target.value)}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                    {user?.role === 'admin' && (
                      <>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditTask(task); setShowModal(true); }}>
                          <Pencil size={13} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}>
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editTask}
          projects={projects}
          users={users}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSaved={() => { setShowModal(false); setEditTask(null); fetchData(); }}
        />
      )}
    </div>
  );
}
