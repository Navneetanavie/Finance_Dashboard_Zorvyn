'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Filter, Search, X, Eye, Pencil } from 'lucide-react';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [role, setRole] = useState('admin');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [formData, setFormData] = useState({ 
    amount: '', 
    type: 'expense', 
    category: '', 
    date: new Date().toISOString().split('T')[0], 
    notes: '' 
  });

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') || 'viewer';
    if (savedRole === 'viewer') {
      window.location.href = '/';
      return;
    }
    setRole(savedRole);
    fetchTransactions(savedRole);
  }, []);

  const fetchTransactions = (r: string) => {
    fetch('/api/records', {
      headers: { 'x-user-role': r }
    })
      .then(res => res.json())
      .then(setTransactions);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, filterType]);

  const handleOpenModal = (mode: 'add' | 'edit' | 'view', record?: any) => {
    setModalMode(mode);
    if (record) {
      setCurrentRecord(record);
      setFormData({
        amount: record.amount.toString(),
        type: record.type,
        category: record.category,
        date: record.date,
        notes: record.notes || ''
      });
    } else {
      setFormData({ 
        amount: '', 
        type: 'expense', 
        category: '', 
        date: new Date().toISOString().split('T')[0], 
        notes: '' 
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (modalMode === 'view') return;

    const url = '/api/records';
    const method = modalMode === 'add' ? 'POST' : 'PUT';
    const body = modalMode === 'add' ? formData : { ...formData, id: currentRecord.id };

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'x-user-role': role
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowModal(false);
      fetchTransactions(role);
    } else {
      const err = await res.json();
      alert(err.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (role !== 'admin') return alert('Access Denied: Only Admins can delete records.');
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    const res = await fetch(`/api/records?id=${id}`, { 
      method: 'DELETE',
      headers: { 'x-user-role': role }
    });
    if (res.ok) fetchTransactions(role);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Transactions</h2>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        )}
      </div>

      <div className="card glass">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search category or notes..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="btn btn-outline" 
            style={{ appearance: 'auto', paddingLeft: '1rem' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Notes</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTransactions.map((t) => (
                  <motion.tr 
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>{t.category}</td>
                    <td style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>{t.notes}</td>
                    <td style={{ fontWeight: '600' }}>${t.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${t.type}`}>{t.type.toUpperCase()}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="action-btn view" 
                          onClick={() => handleOpenModal('view', t)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {role === 'admin' && (
                          <>
                            <button 
                              className="action-btn edit" 
                              onClick={() => handleOpenModal('edit', t)}
                              title="Edit Record"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              className="action-btn delete" 
                              onClick={() => handleDelete(t.id)}
                              title="Delete Record"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
              No transactions found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="card modal-content" style={{ width: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ textTransform: 'capitalize' }}>{modalMode} Transaction</h3>
              <X onClick={() => setShowModal(false)} style={{ cursor: 'pointer' }} />
            </div>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label>Amount</label>
                <input 
                  type="number" 
                  required 
                  disabled={modalMode === 'view'}
                  value={formData.amount} 
                  onChange={e => setFormData({ ...formData, amount: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select 
                  disabled={modalMode === 'view'}
                  value={formData.type} 
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  required 
                  disabled={modalMode === 'view'}
                  value={formData.category} 
                  onChange={e => setFormData({ ...formData, category: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  required 
                  disabled={modalMode === 'view'}
                  value={formData.date} 
                  onChange={e => setFormData({ ...formData, date: e.target.value })} 
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Notes</label>
                <textarea 
                  disabled={modalMode === 'view'}
                  value={formData.notes} 
                  onChange={e => setFormData({ ...formData, notes: e.target.value })} 
                />
              </div>
              {modalMode !== 'view' && (
                <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                  {modalMode === 'add' ? 'Create Record' : 'Save Changes'}
                </button>
              )}
            </form>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #6b7280; }
        .search-input { width: 100%; padding: 0.5rem 0.5rem 0.5rem 2.5rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; background: #f9fafb; outline: none; transition: border-color 0.2s; }
        .search-input:focus { border-color: var(--primary-blue); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; padding: 2rem; border-radius: 1rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.875rem; }
        .form-group label { font-weight: 500; }
        .form-group input, .form-group select, .form-group textarea { padding: 0.5rem; border-radius: 0.25rem; border: 1px solid #e5e7eb; }
        .form-group input:disabled, .form-group select:disabled, .form-group textarea:disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }
        
        .action-btn { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          width: 32px; 
          height: 32px; 
          border-radius: 0.5rem; 
          border: none; 
          cursor: pointer; 
          transition: all 0.2s;
        }
        .action-btn.view { background: #f3f4f6; color: #4b5563; }
        .action-btn.view:hover { background: #e5e7eb; }
        .action-btn.edit { background: #eff6ff; color: #2563eb; }
        .action-btn.edit:hover { background: #dbeafe; }
        .action-btn.delete { background: #fef2f2; color: #dc2626; }
        .action-btn.delete:hover { background: #fee2e2; }
      `}</style>
    </div>
  );
};

export default TransactionsPage;
