import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  Mail, Lock, User, Sparkles, ChevronRight,
  Phone, Upload, Eye, EyeOff, AlertCircle,
  CheckCircle2, Camera
} from 'lucide-react';

const LoginPage = () => {
  const { loginUser, signupUser, isAuthenticated, triggerToast } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login');

  /* ── Login state ───────────────── */
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError]       = useState('');
  const [loginLoading, setLoginLoading]   = useState(false);

  /* ── Register state ────────────── */
  const [registerName,     setRegisterName]     = useState('');
  const [registerEmail,    setRegisterEmail]    = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole,     setRegisterRole]     = useState('client');
  const [registerPhone,    setRegisterPhone]    = useState('');
  const [registerAvatar,   setRegisterAvatar]   = useState('');
  const [avatarPreview,    setAvatarPreview]    = useState('');
  const [showRegPass,      setShowRegPass]      = useState(false);
  const [registerError,    setRegisterError]    = useState('');
  const [registerLoading,  setRegisterLoading]  = useState(false);

  /* Redirect if already logged in */
  useEffect(() => {
    if (isAuthenticated) navigate('/profile');
  }, [isAuthenticated, navigate]);

  /* ── Image Upload ──────────────── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Please upload an image smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setRegisterAvatar(reader.result);
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ── Login Submit ──────────────── */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }
    setLoginLoading(true);
    await new Promise(r => setTimeout(r, 400)); // subtle loading feel
    const success = loginUser(loginEmail, loginPassword);
    setLoginLoading(false);
    if (success) {
      navigate('/profile');
    } else {
      setLoginError('Invalid email or password. Please try again.');
    }
  };

  /* ── Register Submit ───────────── */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (!registerName.trim()) {
      setRegisterError('Full name is required.');
      return;
    }
    if (!registerEmail.trim()) {
      setRegisterError('Email address is required.');
      return;
    }
    if (!registerPassword || registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }
    setRegisterLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const success = signupUser(
      registerName, registerEmail, registerPassword,
      registerRole, registerAvatar, registerPhone
    );
    setRegisterLoading(false);
    if (success) {
      navigate('/profile');
    } else {
      setRegisterError('An account with this email already exists.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">

        {/* ── Header ─────────────────── */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <Sparkles size={13} />
            <span>PickMyShoot</span>
          </div>
          <h2>
            {activeTab === 'login' ? 'Welcome Back 👋' : 'Create Account 🎯'}
          </h2>
          <p>
            {activeTab === 'login'
              ? 'Sign in to access your studios, bookings & portfolio'
              : 'Join the creative community of photographers & studios'}
          </p>
        </div>

        {/* ── Tabs ───────────────────── */}
        <div className="auth-tabs-nav">
          <button
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setLoginError(''); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setRegisterError(''); }}
          >
            Register
          </button>
        </div>

        {/* ── Body ───────────────────── */}
        <div className="auth-body">

          {/* ═══════════ LOGIN FORM ═══════════ */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="auth-form">

              {/* Error message */}
              {loginError && (
                <div className="auth-msg error">
                  <AlertCircle size={15} />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email */}
              <div className="auth-form-group">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrap">
                  <span className="auth-icon"><Mail size={16} /></span>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="auth-input"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-icon"><Lock size={16} /></span>
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="auth-input"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-pass-toggle"
                    onClick={() => setShowLoginPass(v => !v)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In Securely</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ═══════════ REGISTER FORM ═══════════ */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="auth-form">

              {/* Error message */}
              {registerError && (
                <div className="auth-msg error">
                  <AlertCircle size={15} />
                  <span>{registerError}</span>
                </div>
              )}

              {/* Avatar upload */}
              <div className="auth-form-group">
                <label className="auth-label">Profile Photo</label>
                <div className="auth-avatar-row">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      className="auth-avatar-preview"
                    />
                  ) : (
                    <div className="auth-avatar-placeholder">
                      <Camera size={22} />
                    </div>
                  )}
                  <div>
                    <label className="auth-upload-label" htmlFor="auth-avatar-input">
                      <Upload size={14} />
                      <span>{avatarPreview ? 'Change Photo' : 'Upload from Gallery'}</span>
                    </label>
                    <input
                      id="auth-avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <p className="auth-upload-hint">JPG, PNG or WEBP · max 5 MB</p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="auth-form-group">
                <label className="auth-label">Full Name *</label>
                <div className="auth-input-wrap">
                  <span className="auth-icon"><User size={16} /></span>
                  <input
                    type="text"
                    placeholder="e.g. Anusha Reddy"
                    className="auth-input"
                    value={registerName}
                    onChange={e => setRegisterName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="auth-form-group">
                <label className="auth-label">Email Address *</label>
                <div className="auth-input-wrap">
                  <span className="auth-icon"><Mail size={16} /></span>
                  <input
                    type="email"
                    placeholder="anusha@example.com"
                    className="auth-input"
                    value={registerEmail}
                    onChange={e => setRegisterEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="auth-form-group">
                <label className="auth-label">Phone Number</label>
                <div className="auth-input-wrap">
                  <span className="auth-icon"><Phone size={16} /></span>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="auth-input"
                    value={registerPhone}
                    onChange={e => setRegisterPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-form-group">
                <label className="auth-label">Password *</label>
                <div className="auth-input-wrap">
                  <span className="auth-icon"><Lock size={16} /></span>
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    className="auth-input"
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-pass-toggle"
                    onClick={() => setShowRegPass(v => !v)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showRegPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="auth-form-group">
                <label className="auth-label">I am joining as *</label>
                <div className="auth-input-wrap">
                  <select
                    className="auth-select-input"
                    value={registerRole}
                    onChange={e => setRegisterRole(e.target.value)}
                  >
                    <option value="client">🎬 Client / Content Creator</option>
                    <option value="photographer">📸 Photographer / Videographer</option>
                    <option value="admin">🛡️ Studio Administrator</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={registerLoading}
              >
                {registerLoading ? (
                  <span>Creating account…</span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social buttons */}
          <div className="social-login-separator">
            <span>or continue with</span>
          </div>
          <div className="social-login-grid">
            <button
              className="social-btn"
              type="button"
              onClick={() => triggerToast('Social login coming soon. Use the form above!')}
            >
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                <path d="M43.6 20.5H42V20H24v8h11.3C33.65 32.09 29.27 35 24 35c-6.07 0-11-4.93-11-11s4.93-11 11-11c2.8 0 5.35 1.06 7.28 2.78l5.66-5.66C33.46 7.11 28.97 5 24 5 12.96 5 4 13.96 4 25s8.96 20 20 20 20-8.96 20-20c0-1.34-.14-2.65-.4-3.5z" fill="#FFC107"/>
                <path d="M6.3 14.69l6.57 4.82C14.53 15.08 18.96 12 24 12c2.8 0 5.35 1.06 7.28 2.78l5.66-5.66C33.46 5.11 28.97 3 24 3 16.32 3 9.66 7.88 6.3 14.69z" fill="#FF3D00"/>
                <path d="M24 45c4.84 0 9.24-1.85 12.55-4.87l-5.8-4.91C28.99 36.99 26.6 38 24 38c-5.25 0-9.62-3.58-11.23-8.41l-6.52 5.02C9.51 41.02 16.27 45 24 45z" fill="#4CAF50"/>
                <path d="M43.6 20.5H42V20H24v8h11.3a11.54 11.54 0 01-4.15 5.19l5.8 4.91C36.45 40.5 44 35 44 25c0-1.34-.14-2.65-.4-3.5z" fill="#1976D2"/>
              </svg>
              Google
            </button>
            <button
              className="social-btn"
              type="button"
              onClick={() => triggerToast('Social login coming soon. Use the form above!')}
            >
              <svg width="16" height="16" viewBox="0 0 814 1000" fill="currentColor">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-105C159.4 652 105 439.4 105 281.6c0-137.9 70.6-211.5 166.2-211.5 71.8 0 127 40.8 174.4 40.8 43.3 0 108.2-40.8 186.6-40.8 30.5 0 110.7 2.6 167.4 71.6zm-220.9-213.3c31.3-38.7 53.5-92.7 53.5-146.7 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 86.4-55.1 141.2 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.1-69.6z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Switch tab hint */}
          <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: 'var(--text-muted)' }}>
            {activeTab === 'login' ? (
              <>Don't have an account?{' '}
                <button
                  type="button"
                  style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:700, cursor:'pointer', fontSize:'13px', fontFamily:'inherit' }}
                  onClick={() => { setActiveTab('register'); setLoginError(''); }}
                >
                  Register free →
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button
                  type="button"
                  style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:700, cursor:'pointer', fontSize:'13px', fontFamily:'inherit' }}
                  onClick={() => { setActiveTab('login'); setRegisterError(''); }}
                >
                  Sign in →
                </button>
              </>
            )}
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
