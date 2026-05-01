import { useEffect, useState } from 'react';
import API from '../utils/api';
import { Users } from 'lucide-react';

export default function Team() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/users').then(r => setUsers(r.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Team</div>
          <div className="page-sub">{users.length} member{users.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <div style={{ marginTop: 12 }}>No team members yet</div>
        </div>
      ) : (
        <div className="grid grid-2">
          {users.map(u => (
            <div className="card" key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, flexShrink: 0
              }}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{u.email}</div>
                <span className={`badge badge-${u.role}`}>{u.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
