'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Users, LogOut, ShieldCheck, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedName = localStorage.getItem('userName');
    
    if (!savedRole && pathname !== '/login') {
      window.location.href = '/login';
    } else {
      setRole(savedRole || 'viewer');
      setUserName(savedName || 'User');
    }
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Home, roles: ['viewer', 'analyst', 'admin'] },
    { label: 'Transactions', path: '/transactions', icon: List, roles: ['analyst', 'admin'] },
    { label: 'Management', path: '/users', icon: Users, roles: ['admin'] },
  ];

  if (pathname === '/login') return null;

  return (
    <aside className="sidebar">
      <div className="branding" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <div style={{ background: 'white', padding: '0.4rem', borderRadius: '0.6rem' }}>
          <ShieldCheck style={{ color: 'var(--primary-blue)' }} size={24} />
        </div>
        <h1>FinanceHub</h1>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          if (!item.roles.includes(role)) return null;
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="role-profile-card">
        <div className="role-tag" style={{ background: role === 'admin' ? '#ef4444' : 'var(--accent-blue)' }}>{role}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userName}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Authenticated Session</div>
          </div>
        </div>
      </div>

      <div className="footer-nav" style={{ marginTop: '1.5rem' }}>
        <button 
          className="nav-item" 
          style={{ width: '100%', border: 'none', background: 'none', paddingLeft: '1.25rem', color: '#ff6b6b' }}
          onClick={handleSignOut}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
