'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, Filter, Search, BarChart3, Calendar } from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title
);

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [trendView, setTrendView] = useState<'monthly' | 'weekly'>('monthly');

  useEffect(() => {
    fetch('/api/summary')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => console.error('Dashboard Load Error:', err));
  }, []);

  const filteredActivity = useMemo(() => {
    if (!data?.recentActivity) return [];
    return data.recentActivity.filter((r: any) => {
      const matchesSearch = r.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || r.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [data?.recentActivity, searchQuery, filterType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (data?.error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '1rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Database Connection Error</h2>
        <p>{data.error}</p>
      </div>
    );
  }

  const { 
    summary = { netBalance: 0, totalIncome: 0, totalExpenses: 0 }, 
    categorySummary = [], 
    monthlyTrends = [], 
    weeklyTrends = [] 
  } = data || {};

  const pieData = {
    labels: categorySummary.map((c: any) => c.category),
    datasets: [{
      data: categorySummary.map((c: any) => c.total),
      backgroundColor: ['#30476b', '#4a6fa5', '#6b7280', '#0088cc', '#10b981'],
      borderWidth: 0,
    }],
  };

  const trendData = {
    labels: trendView === 'monthly' ? monthlyTrends.map((t: any) => t.month) : weeklyTrends.map((t: any) => t.date),
    datasets: [
      {
        label: 'Income',
        data: trendView === 'monthly' ? monthlyTrends.map((t: any) => t.income) : weeklyTrends.map((t: any) => t.income),
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: trendView === 'monthly' ? monthlyTrends.map((t: any) => t.expense) : weeklyTrends.map((t: any) => t.expense),
        backgroundColor: '#ef4444',
        borderColor: '#ef4444',
        borderRadius: 4,
      }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary-blue)', letterSpacing: '-0.02em' }}>Dashboard</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}>Real-time insights into your financial health.</p>
        </div>
        <div style={{ background: 'white', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', gap: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <button 
            onClick={() => setTrendView('monthly')}
            className={`btn ${trendView === 'monthly' ? 'btn-primary' : ''}`}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
          >Monthly</button>
          <button 
            onClick={() => setTrendView('weekly')}
            className={`btn ${trendView === 'weekly' ? 'btn-primary' : ''}`}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
          >Weekly</button>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard title="Net Balance" value={summary.netBalance} icon={Wallet} type="balance" />
        <StatCard title="Total Income" value={summary.totalIncome} icon={ArrowUpCircle} type="income" />
        <StatCard title="Total Expenses" value={summary.totalExpenses} icon={ArrowDownCircle} type="expense" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} /> Financial Trends
            </h3>
          </div>
          <div style={{ height: '300px' }}>
            <Bar 
              data={trendData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' as const } },
                scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
              }} 
            />
          </div>
        </div>

        <div className="card glass">
          <h3 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Expense Breakdown</h3>
          <div style={{ padding: '0.5rem' }}>
            <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      <div className="card glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontWeight: '700' }}>Recent Transactions</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '500px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.2rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredActivity.map((r: any) => (
                  <motion.tr 
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>{r.category}</td>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: '600' }}>${r.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${r.type}`}>
                        {r.type.toUpperCase()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredActivity.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No transactions match your search.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon: Icon, type }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`card stat-card ${type}`}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</span>
      <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem' }}>
        <Icon size={20} />
      </div>
    </div>
    <div className="stat-value">
      {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
    </div>
  </motion.div>
);

export default Dashboard;
