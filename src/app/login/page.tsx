'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, ArrowRight, UserCircle, Lock, AlertCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, name: email.split('@')[0] }),
      });

      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name);
        router.push('/'); // Smooth client-side navigation
      } else {
        const data = await res.json();
        setError(data.error || 'Authentication failed. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Connection error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="background-shapes" style={{ pointerEvents: 'none' }}>
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="login-card-v2"
        style={{ position: 'relative', zIndex: 100, width: '600px' }}
      >
       

        <div className="login-main">
          <div className="form-container">
            <div className="form-header">
              <h2>Sign In</h2>
              <p>Enter your details below to access your account.</p>
            </div>

       
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: -20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="error-popup"
                >
                  <div className="error-popup-content">
                    <AlertCircle size={20} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '800', margin: 0, fontSize: '0.85rem' }}>Authentication Alert</p>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '0.75rem', lineHeight: '1.4' }}>{error}</p>
                    </div>
                    <button onClick={() => setError('')} className="close-popup">
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
           

            <form onSubmit={handleLogin} style={{ position: 'relative', zIndex: 110 }}>
              <div className="input-field">
                <label>Email Address</label>
                <div className="input-inner">
                  <Mail size={18} className="field-icon" />
                  <input 
                    type="email" 
                    required 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-field">
                <label>Select Your Role</label>
                <div className="role-grid-v2">
                  {['admin', 'analyst', 'viewer'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`role-tab-v2 ${role === r ? 'active' : ''}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn-v2">
                {loading ? 'Processing...' : 'Continue to Dashboard'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
            
            <div className="form-footer">
              <p>Don't have an account? Just sign in and we'll create one for you.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .login-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
        }
        .background-shapes {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }
        .shape-1 { width: 400px; height: 400px; background: #30476b; top: -100px; left: -100px; }
        .shape-2 { width: 300px; height: 300px; background: #0088cc; bottom: -50px; right: -50px; }
        
        .login-card-v2 {
          display: flex;
          width: 100%;
          max-width: 500px;
          background: white;
          border-radius: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          margin: 0 auto;
        }

        .login-main { 
          flex: 1; 
          padding: 3.5rem 3rem; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        
        .form-container { width: 100%; }
        .form-header { margin-bottom: 2rem; text-align: center; }
        .form-header h2 { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; }
        .form-header p { color: #64748b; font-size: 0.875rem; }

        .error-popup {
          position: fixed;
          top: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          width: 100%;
          max-width: 400px;
          padding: 0 1rem;
        }

        .error-popup-content {
          background: #1a2a3a;
          color: white;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }

        .close-popup {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-popup:hover {
          background: rgba(255,255,255,0.2);
        }
        
        .input-field { margin-bottom: 1.5rem; }
        .input-field label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; margin-bottom: 0.6rem; }
        .input-inner { position: relative; }
        .field-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        input { width: 100%; padding: 0.85rem 1rem 0.85rem 2.85rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1rem; color: #1e293b; font-size: 0.95rem; outline: none; transition: all 0.2s; }
        input:focus { border-color: #30476b; background: white; box-shadow: 0 0 0 4px rgba(48, 71, 107, 0.05); }
        
        .role-grid-v2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
        .role-tab-v2 { padding: 0.65rem; background: #f1f5f9; border: 2px solid transparent; border-radius: 0.75rem; color: #475569; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; cursor: pointer; transition: all 0.2s; }
        .role-tab-v2.active { background: white; border-color: #30476b; color: #30476b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        
        .submit-btn-v2 { width: 100%; padding: 1rem; background: #30476b; color: white; border: none; border-radius: 1rem; font-size: 1rem; font-weight: 700; margin-top: 2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.2s; }
        .submit-btn-v2:hover { background: #1a2a3a; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .submit-btn-v2:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        
        .form-footer { margin-top: 2rem; text-align: center; }
        .form-footer p { color: #94a3b8; font-size: 0.75rem; line-height: 1.5; }

        @media (max-width: 768px) {
          .login-sidebar { display: none; }
          .login-card-v2 { max-width: 450px; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
