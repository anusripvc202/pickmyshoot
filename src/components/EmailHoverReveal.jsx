import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const EmailHoverReveal = ({ email }) => {
  const { currentUser } = useAppContext();
  const [hovered, setHovered] = useState(false);

  // Checks if the active user is Google-authenticated
  const isGoogleAuth = currentUser && currentUser.authProvider === 'google';

  // Check if email is already masked by backend or is empty
  const isMaskedOrEmpty = !email || email.includes('***') || email === '[Hidden]';

  const getDisplayEmail = () => {
    if (!email) return 'N/A';
    if (isMaskedOrEmpty) return email; // Return backend-masked email as is
    
    // If Google-authenticated, show dots by default, full email on hover
    if (isGoogleAuth) {
      return hovered ? email : '•••••••••••••••••';
    }
    
    // Fallback in case backend returned full email but frontend session is not Google-auth (safety)
    // Mask it on the client side just in case!
    return maskEmailClientSide(email);
  };

  const maskEmailClientSide = (val) => {
    const parts = val.split('@');
    if (parts.length !== 2) return val;
    const [local, domain] = parts;
    if (local.length <= 2) {
      return `${local.charAt(0)}***@${domain}`;
    }
    return `${local.charAt(0)}***${local.charAt(local.length - 1)}@${domain}`;
  };

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-block',
        cursor: isMaskedOrEmpty ? 'default' : 'pointer',
        padding: '2px 8px',
        borderRadius: '6px',
        background: hovered && !isMaskedOrEmpty ? 'rgba(200, 16, 46, 0.06)' : 'transparent',
        color: hovered && !isMaskedOrEmpty ? 'var(--primary, #C8102E)' : 'inherit',
        borderBottom: !hovered && !isMaskedOrEmpty ? '1.5px dashed var(--primary, #C8102E)' : '1.5px solid transparent',
        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        fontWeight: hovered && !isMaskedOrEmpty ? '600' : 'inherit',
        fontFamily: 'monospace',
        fontSize: '0.95em'
      }}
      title={isMaskedOrEmpty ? 'Authenticate with Google to view' : 'Hover to reveal email address'}
    >
      {getDisplayEmail()}
    </span>
  );
};

export default EmailHoverReveal;
