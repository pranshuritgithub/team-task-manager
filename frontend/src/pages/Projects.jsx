import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, Users, FolderOpen } from 'lucide-react';

function ProjectModal({ onClose, onSaved, users }) {
  const [form, setForm] = useState({ name: '', description: '', members: [] });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/projects', form);
      toast.success('Project created!');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      members: f.members.includes(id) ? f.members.filter(m => m !== id) : [...f.members, id]
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">New Project</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name *</label>
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Website Redesign" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="input" style={{ resize: 'vertical', minHeight: 80 }}
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" />
          </div>
          <div className="form-group">
            <label>Add Team Members</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
              {users.map(u => (
                <label key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text)' }}>
                  <input type="checkbox" checked={form.members.includes(u._id)} onChange={() => toggleMember(u._id)} />
                  {u.name} <span style={{ color: 'var(--muted)', fontSize: 12 }}>({u.email})</span>
                  <span className={`badge badge-${u.role}`}>{u.role}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    const [p, u] = await Promise.all([API.get('/projects'), API.get('/users')]);
    setProjects(p.data);
    setUsers(u.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchData();
    } catch {
      toast.error('Error deleting project');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Projects</div>
          <div className="page-sub">{projects.length} project{projects.length !== 1 ? 's' : ''}</div>
        </div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <FolderOpen size={48} />
          <div style={{ marginTop: 12, fontWeight: 600 }}>No projects yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {user?.role === 'admin' ? 'Create your first project to get started.' : 'You haven\'t been added to any project yet.'}
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {projects.map(p => (
            <div className="card" key={p._id} style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{p.name}</div>
                {user?.role === 'admin' && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}><Trash2 size={14} /></button>
                )}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>
                {p.description || 'No description'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Users size={14} color="var(--muted)" />
                {p.members.length === 0 ? (
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>No members</span>
                ) : p.members.map(m => (
                  <span key={m._id} className="badge badge-member">{m.name}</span>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
                By {p.createdBy?.name} · {new Date(p.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <ProjectModal users={users} onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); fetchData(); }} />}
    </div>
  );
}
