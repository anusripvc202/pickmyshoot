import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ResetPasswordPage = () => {
  const { triggerToast } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!token) {
      setError('Invalid reset link: Missing verification token.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setSuccess(true);
      triggerToast('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container" style={{ minHeight: 'calc(100vh - 100px)', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ width: '100%', maxWidth: '440px', background: '#fff', borderRadius: '24px', boxShadow: 'var(--shadow-lg, 0 10px 30px rgba(0,0,0,0.08))', padding: '32px' }}>
        
        {/* Header */}
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="auth-brand-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(200, 16, 46, 0.08)', color: 'var(--primary, #C8102E)', fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>
            <Sparkles size={13} />
            <span>PickMyShoot</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main, #222)', margin: '0 0 8px' }}>
            Choose New Password
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted, #5f6368)', margin: 0, lineHeight: 1.5 }}>
            Create a secure new password for your PickMyShoot account
          </p>
        </div>

        {/* Body */}
        <div className="auth-body">
          <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {error && (
              <div className="auth-msg error" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '13.5px' }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="auth-msg success" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', fontSize: '13.5px' }}>
                <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                <span>Password updated successfully! Redirecting you to sign in...</span>
              </div>
            ) : (
              <>
                {/* New Password */}
                <div className="auth-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="auth-label" style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-main, #222)' }}>
                    New Password
                  </label>
                  <div className="auth-input-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span className="auth-icon" style={{ position: 'absolute', left: '14px', color: '#888', display: 'flex', alignItems: 'center' }}>
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="auth-input"
                      style={{ width: '100%', padding: '12px 44px 12px 42px', borderRadius: '12px', border: '1.5px solid var(--border, #e8eaed)', outline: 'none', fontSize: '14.5px', transition: 'border-color 0.2s' }}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-pass-toggle"
                      style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                      onClick={() => setShowPass(v => !v)}
                      tabIndex={-1}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="auth-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="auth-label" style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-main, #222)' }}>
                    Confirm New Password
                  </label>
                  <div className="auth-input-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span className="auth-icon" style={{ position: 'absolute', left: '14px', color: '#888', display: 'flex', alignItems: 'center' }}>
                      <Lock size={16} />
                    </span>
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="auth-input"
                      style={{ width: '100%', padding: '12px 44px 12px 42px', borderRadius: '12px', border: '1.5px solid var(--border, #e8eaed)', outline: 'none', fontSize: '14.5px', transition: 'border-color 0.2s' }}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-pass-toggle"
                      style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                      onClick={() => setShowConfirmPass(v => !v)}
                      tabIndex={-1}
                    >
                      {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  style={{ width: '100%', padding: '14px', border: 'none', borderRadius: '12px', background: 'var(--primary, #C8102E)', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px', transition: 'background 0.2s' }}
                  disabled={loading}
                >
                  {loading ? (
                    <span>Updating password…</span>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;
