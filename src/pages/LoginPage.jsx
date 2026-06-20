import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, User, Sparkles, ChevronRight } from 'lucide-react';

const LoginPage = () => {
  const { loginUser, signupUser, profiles, isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('Verified Photographer');

  // If already authenticated, redirect to profile immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    const success = loginUser(loginEmail, loginPassword);
    if (success) {
      navigate('/profile');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerName || !registerEmail) return;
    const success = signupUser(registerName, registerEmail, registerPassword, registerRole);
    if (success) {
      navigate('/profile');
    }
  };

  const handleDemoLogin = (profileId) => {
    const success = loginUser('', '', profileId);
    if (success) {
      navigate('/profile');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header Branding */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <Sparkles size={14} color="var(--primary)" />
            <span>Secure Access</span>
          </div>
          <h2>Join PickMyShoot</h2>
          <p>Book premium studio lot spaces & camera equipment listings instantly</p>
        </div>

        {/* Tab switchers */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Tab body */}
        <div className="auth-body">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="auth-input-group">
                <label className="auth-input-label">Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={16} color="var(--text-muted)" />
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Password</label>
                <div className="auth-input-wrap">
                  <Lock size={16} color="var(--text-muted)" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn">
                <span>Sign In to Account</span>
                <ChevronRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="auth-input-group">
                <label className="auth-input-label">Full Name</label>
                <div className="auth-input-wrap">
                  <User size={16} color="var(--text-muted)" />
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={16} color="var(--text-muted)" />
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Professional Role</label>
                <div className="auth-input-wrap">
                  <select 
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value)}
                    className="auth-select-input"
                  >
                    <option value="Verified Photographer">Photographer / Cinematographer</option>
                    <option value="Verified Studio Partner">Studio Operator / Owner</option>
                    <option value="Verified Model">Professional Talent / Model</option>
                    <option value="Verified Gear Rental">Equipment supplier</option>
                    <option value="Verified Creator">Independent Creator</option>
                  </select>
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Create Password</label>
                <div className="auth-input-wrap">
                  <Lock size={16} color="var(--text-muted)" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn">
                <span>Create Creator Profile</span>
                <ChevronRight size={16} />
              </button>
            </form>
          )}

          {/* Social Mock Logins */}
          <div className="social-login-separator">
            <span>or connect with</span>
          </div>

          <div className="social-login-grid">
            <button className="social-btn" onClick={() => handleDemoLogin('prof-client')}>
              Google
            </button>
            <button className="social-btn" onClick={() => handleDemoLogin('prof-photographer')}>
              Apple ID
            </button>
          </div>

          {/* Demo Accounts Board */}
          <div className="demo-accounts-board">
            <h4>Quick Demo Logins</h4>
            <p>Click below to log in instantly using pre-configured mock credentials:</p>
            <div className="demo-actions-flex">
              {profiles.map(p => (
                <button 
                  key={p.id} 
                  type="button" 
                  className="demo-profile-login-pill"
                  onClick={() => handleDemoLogin(p.id)}
                >
                  <img src={p.avatar} alt={p.name} />
                  <div className="demo-pill-meta">
                    <span className="demo-pill-name">{p.name}</span>
                    <span className="demo-pill-role">{p.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
