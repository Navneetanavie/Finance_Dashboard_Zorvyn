'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Shield, Activity, Mail } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(d => {
        setUsers(d);
        setLoading(false);
      });
  };

  const updateUser = async (id: number, role: string, status: string) => {
    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role, status }),
    });
    if (res.ok) fetchUsers();
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>User & Access Management</h2>
        <p style={{ color: 'var(--text-light)' }}>Configure permissions and manage organizational member status.</p>
      </header>

      <div className="grid-users">
        {users.map((user) => (
          <motion.div 
            key={user.id} 
            className="card glass user-card"
            whileHover={{ y: -5 }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="avatar">
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 style={{ fontWeight: '600' }}>{user.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', fontSize: '0.75rem' }}>
                  <Mail size={12} />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="user-controls">
              <div className="control-group">
                <label><Shield size={14} /> Role</label>
                <select 
                  value={user.role} 
                  onChange={(e) => updateUser(user.id, e.target.value, user.status)}
                >
                  <option value="admin">Admin</option>
                  <option value="analyst">Analyst</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div className="control-group">
                <label><Activity size={14} /> Status</label>
                <select 
                  value={user.status} 
                  onChange={(e) => updateUser(user.id, user.role, e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .grid-users {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .user-card {
          padding: 1.5rem;
          border-radius: 1rem;
        }
        .avatar {
          width: 48px;
          height: 48px;
          background: var(--primary-blue);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.25rem;
        }
        .user-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(0,0,0,0.05);
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .control-group label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-light);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .control-group select {
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          background: white;
          font-size: 0.875rem;
          outline: none;
        }
        .control-group select:focus {
          border-color: var(--primary-blue);
        }
      `}</style>
    </motion.div>
  );
};

export default UsersPage;
