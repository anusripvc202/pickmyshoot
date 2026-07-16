import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  Mail, Lock, User, Sparkles, ChevronRight,
  Phone, Upload, Eye, EyeOff, AlertCircle,
  CheckCircle2, Camera
} from 'lucide-react';

const LoginPage = () => {
  const { loginUser, signupUser, isAuthenticated, triggerToast, loginOrSignupGoogle } = useAppContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirect = searchParams.get('redirect') || '/profile';
  
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'login';
  });

  /* ── Login state ───────────────── */
  const [loginEmail, setLoginEmail]       = useState(() => {
    return localStorage.getItem('pickmyshoot_remembered_email') || '';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError]       = useState('');
  const [loginLoading, setLoginLoading]   = useState(false);
  const [rememberMe, setRememberMe]       = useState(() => {
    return localStorage.getItem('pickmyshoot_remember_me') === 'true';
  });

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

  /* ── Forgot Password state ──────── */
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  /* Redirect if already logged in */
  useEffect(() => {
    if (isAuthenticated) navigate(redirect);
  }, [isAuthenticated, navigate, redirect]);

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

  /* ── Google Login popup trigger ── */
  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      '/mock-google-login.html', 
      'Google Sign In', 
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
    );

    const messageListener = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data && event.data.type === 'GOOGLE_SIGNIN_SUCCESS') {
        const { name, email, avatar } = event.data.user;
        loginOrSignupGoogle(name, email, avatar).then((success) => {
          if (success) {
            navigate(redirect);
          }
        });
        window.removeEventListener('message', messageListener);
      }
    };

    window.addEventListener('message', messageListener);
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
    const result = await loginUser(loginEmail, loginPassword);
    setLoginLoading(false);
    if (result && result.success) {
      if (rememberMe) {
        localStorage.setItem('pickmyshoot_remembered_email', loginEmail);
        localStorage.setItem('pickmyshoot_remember_me', 'true');
      } else {
        localStorage.removeItem('pickmyshoot_remembered_email');
        localStorage.setItem('pickmyshoot_remember_me', 'false');
      }
      navigate(redirect);
    } else {
      setLoginError(result?.error || 'Invalid email or password. Please try again.');
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
      navigate(redirect);
    } else {
      setRegisterError('An account with this email already exists.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess(false);

    if (!forgotEmail) {
      setForgotError('Please enter your email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset link.');
      }

      setForgotSuccess(true);
      triggerToast('Reset password email sent successfully!');
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
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
            {activeTab === 'login' ? 'Welcome Back 👋' : activeTab === 'register' ? 'Create Account 🎯' : 'Reset Password 🔒'}
          </h2>
          <p>
            {activeTab === 'login'
              ? 'Sign in to access your studios, bookings & portfolio'
              : activeTab === 'register'
              ? 'Join the creative community of photographers & studios'
              : 'Enter your email address to receive a secure password reset link'}
          </p>
        </div>

        {/* ── Tabs ───────────────────── */}
        {activeTab !== 'forgot-password' && (
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
        )}

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

              {/* Remember Me & Forgot Password */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0 20px' }}>
                <div className="auth-remember-me-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="remember-me" style={{ fontSize: '14px', color: 'var(--text-muted, #5f6368)', cursor: 'pointer', userSelect: 'none' }}>
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => { setActiveTab('forgot-password'); setForgotError(''); setForgotSuccess(false); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary, #C8102E)',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot password?
                </button>
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

          {/* ═══════════ FORGOT PASSWORD FORM ═══════════ */}
          {activeTab === 'forgot-password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="auth-form">
              {forgotSuccess ? (
                <div className="auth-msg success" style={{ marginBottom: '20px' }}>
                  <CheckCircle2 size={15} />
                  <span>Reset link sent successfully! Check your email inbox.</span>
                </div>
              ) : (
                <>
                  {forgotError && (
                    <div className="auth-msg error" style={{ marginBottom: '20px' }}>
                      <AlertCircle size={15} />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <div className="auth-form-group">
                    <label className="auth-label">Email Address</label>
                    <div className="auth-input-wrap">
                      <span className="auth-icon"><Mail size={16} /></span>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        className="auth-input"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={forgotLoading}
                    style={{ marginTop: '10px' }}
                  >
                    {forgotLoading ? (
                      <span>Sending link…</span>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </>
              )}

              <button
                type="button"
                className="auth-secondary-btn"
                onClick={() => { setActiveTab('login'); setForgotError(''); setForgotSuccess(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #5f6368)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'center',
                  marginTop: '15px'
                }}
              >
                Back to Sign In
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
              onClick={handleGoogleLogin}
            >
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                <path d="M43.6 20.5H42V20H24v8h11.3C33.65 32.09 29.27 35 24 35c-6.07 0-11-4.93-11-11s4.93-11 11-11c2.8 0 5.35 1.06 7.28 2.78l5.66-5.66C33.46 7.11 28.97 5 24 5 12.96 5 4 13.96 4 25s8.96 20 20 20 20-8.96 20-20c0-1.34-.14-2.65-.4-3.5z" fill="#FFC107"/>
                <path d="M6.3 14.69l6.57 4.82C14.53 15.08 18.96 12 24 12c2.8 0 5.35 1.06 7.28 2.78l5.66-5.66C33.46 5.11 28.97 3 24 3 16.32 3 9.66 7.88 6.3 14.69z" fill="#FF3D00"/>
                <path d="M24 45c4.84 0 9.24-1.85 12.55-4.87l-5.8-4.91C28.99 36.99 26.6 38 24 38c-5.25 0-9.62-3.58-11.23-8.41l-6.52 5.02C9.51 41.02 16.27 45 24 45z" fill="#4CAF50"/>
                <path d="M43.6 20.5H42V20H24v8h11.3a11.54 11.54 0 01-4.15 5.19l5.8 4.91C36.45 40.5 44 35 44 25c0-1.34-.14-2.65-.4-3.5z" fill="#1976D2"/>
              </svg>
              Google
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
