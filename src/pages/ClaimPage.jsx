import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  UserPlus, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

const ClaimPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, triggerToast, changeUserRole } = useAppContext();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/photographers?slug=${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("We couldn't find a photographer profile with this claim link.");
          }
          throw new Error(`Server returned status ${res.status}`);
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  const handleConfirmClaim = async () => {
    if (!isAuthenticated || !currentUser) {
      triggerToast("Please log in to claim this profile.");
      return;
    }

    setClaimLoading(true);
    setClaimError(null);

    try {
      const res = await fetch('/api/claim-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          email: currentUser.email,
          userId: currentUser.id || currentUser._id
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to claim profile.');
      }

      setClaimSuccess(true);
      triggerToast('✓ Profile claimed successfully! Welcome aboard!');
      
      // Change workspace role to photographer
      changeUserRole('photographer');

    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaimLoading(false);
    }
  };

  const handleRedirectToLogin = (tab = 'login') => {
    const path = `/login?redirect=${encodeURIComponent(`/claim/${slug}`)}${tab === 'register' ? '&tab=register' : ''}`;
    navigate(path);
  };

  return (
    <div className="auth-page-container" style={{ background: '#f8f9fa' }}>
      <div className="auth-card" style={{ maxWidth: '520px', minHeight: 'auto', padding: '36px' }}>
        
        {/* Header Badge */}
        <div className="auth-header" style={{ padding: 0, marginBottom: '24px' }}>
          <div className="auth-brand-badge" style={{ marginBottom: '16px' }}>
            <Sparkles size={12} style={{ marginRight: '6px' }} />
            <span>PickMyShoot Directory</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            Claim Professional Listing
          </h2>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#ffffff' }}>
            <RefreshCw size={36} className="status-icon animate-spin" style={{ margin: '0 auto 16px', animation: 'spin 1.5s linear infinite' }} />
            <p style={{ fontSize: '15px', fontWeight: '600' }}>Retrieving listing details...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.2)', textAlign: 'center', marginBottom: '20px' }}>
            <AlertTriangle size={48} color="#ffffff" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', lineHeight: 1.6 }}>{error}</p>
            <button 
              onClick={() => navigate('/')} 
              className="auth-submit-btn" 
              style={{ marginTop: '20px', background: '#ffffff', color: '#C8102E' }}
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Content loaded successfully */}
        {!loading && !error && profile && (
          <div>
            {/* Listing Details Card */}
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                Listing Profile
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>
                {profile.name}
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                📍 {profile.location || 'Unknown Location'}
              </p>
              <div style={{ display: 'inline-block', marginTop: '12px', padding: '4px 10px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '6px', fontSize: '11px', color: '#ffffff', fontWeight: '700' }}>
                Slug ID: {profile.slug}
              </div>
            </div>

            {/* Step 1: Claim Successful */}
            {claimSuccess ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ display: 'flex', justifySelf: 'center', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#ffffff', color: '#C8102E', margin: '0 auto 20px' }}>
                  <ShieldCheck size={36} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
                  Listing Linked Successfully!
                </h4>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, marginBottom: '24px' }}>
                  You are now the official owner of the profile <strong>{profile.name}</strong>. You can now edit your listings, block dates, update experiences, and activate verification.
                </p>
                <button 
                  onClick={() => navigate('/dashboard/photographer')} 
                  className="auth-submit-btn" 
                  style={{ background: '#ffffff', color: '#C8102E', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                >
                  <span>Go to Photographer Dashboard</span>
                  <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            ) : (
              /* Step 2: Display auth conditions */
              <div>
                {!isAuthenticated ? (
                  /* Not Authenticated: Prompt Login/Signup */
                  <div>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, marginBottom: '24px', textAlign: 'center' }}>
                      To claim this profile and associate it with your directory listings, please sign in to your PickMyShoot account or register a free professional account.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button 
                        onClick={() => handleRedirectToLogin('login')} 
                        className="auth-submit-btn" 
                        style={{ background: '#ffffff', color: '#C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Lock size={15} style={{ marginRight: '8px' }} />
                        <span>Sign In to Claim Profile</span>
                      </button>
                      <button 
                        onClick={() => handleRedirectToLogin('register')} 
                        className="auth-submit-btn" 
                        style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <UserPlus size={15} style={{ marginRight: '8px' }} />
                        <span>Register &amp; Claim Profile</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Authenticated: Prompt Confirmation */
                  <div>
                    <div style={{ background: 'rgba(0, 0, 0, 0.15)', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1.5px solid rgba(255, 255, 255, 0.1)' }}>
                      <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '4px' }}>
                        You are currently signed in as:
                      </p>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                        {currentUser?.name || 'User'}
                      </div>
                      <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', fontFamily: 'monospace' }}>
                        {currentUser?.email}
                      </div>
                    </div>

                    {claimError && (
                      <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.25)', color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '18px', textAlign: 'left' }}>
                        ✗ {claimError}
                      </div>
                    )}

                    <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5, marginBottom: '24px', textAlign: 'center' }}>
                      Click below to link this profile to your current logged-in account. This will give you administrative control over the catalog listing.
                    </p>

                    <button 
                      onClick={handleConfirmClaim} 
                      disabled={claimLoading}
                      className="auth-submit-btn" 
                      style={{ background: '#ffffff', color: '#C8102E', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {claimLoading ? (
                        <span>Processing Claim...</span>
                      ) : (
                        <>
                          <ShieldCheck size={16} style={{ marginRight: '8px' }} />
                          <span>Confirm Claim Listing</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ClaimPage;
