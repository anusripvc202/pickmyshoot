import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const BookingsPage = () => {
  const {
    bookings,
    bookingFilter,
    setBookingFilter,
    activeProfileId,
    currentUser,
    currentRole,
    updateBookingStatus
  } = useAppContext();
  const navigate = useNavigate();

  // Filter based on logged-in user profile/role
  const myBookings = bookings.filter(b => {
    if (!currentUser) return false;
    if (currentRole === 'admin') return true; // Admins see all bookings
    if (currentRole === 'photographer') {
      return b.ownerId === activeProfileId || b.creatorId === activeProfileId;
    }
    // For clients (or default)
    return b.clientId === activeProfileId;
  });

  const filteredBookings = myBookings.filter(b => 
    bookingFilter === 'upcoming' 
      ? (b.status === 'confirmed' || b.status === 'pending') 
      : (b.status === 'completed' || b.status === 'cancelled')
  );

  const upcomingCount = myBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
  const completedCount = myBookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length;

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <span className="bookings-title">My Bookings Dashboard</span>
        
        <div className="bookings-tabs">
          <button 
            className={`booking-tab-btn ${bookingFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setBookingFilter('upcoming')}
          >
            Upcoming Bookings ({upcomingCount})
          </button>
          <button 
            className={`booking-tab-btn ${bookingFilter === 'past' ? 'active' : ''}`}
            onClick={() => setBookingFilter('past')}
          >
            Completed / Cancelled ({completedCount})
          </button>
        </div>
      </div>

      {!currentUser ? (
        <div className="empty-bookings">
          <span className="empty-bookings-title">Sign in to view your bookings</span>
          <span className="empty-bookings-desc">You must be signed in to view and manage your scheduled reservations.</span>
          <button 
            className="pro-btn-primary theme-btn-client" 
            onClick={() => navigate('/login')}
            style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 600 }}
          >
            Sign In Now
          </button>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map(book => (
            <div key={book.id} className="booking-card">
              <img 
                src={book.item?.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=180&q=80'} 
                className="booking-card-image" 
                alt={book.item?.title || book.title || 'Reserved Item'} 
              />
              <div className="booking-card-info">
                <span className="booking-card-title">{book.item?.title || book.title || 'Reserved Item'}</span>
                <div className="booking-card-details">
                  <span>🏷️ Category: <strong>{book.itemType || 'Service'}</strong></span>
                  {book.itemType === 'Job' ? (
                    <>
                      <span>🏢 Company: <strong>{book.item?.company || 'Creative Studio'}</strong></span>
                      <span>📍 Job Location: <strong>{book.item?.location || 'Remote'}</strong></span>
                      {book.resumeUrl && (
                        <span>📄 Resume: <strong><a href={book.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>View Resume</a></strong></span>
                      )}
                      {book.portfolioUrl && (
                        <span>🌐 Portfolio: <strong><a href={book.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>View Portfolio</a></strong></span>
                      )}
                      {book.coverLetter && (
                        <div style={{ marginTop: '8px', fontSize: '11px', background: 'var(--bg-app)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                          <strong style={{ color: 'var(--text-muted)' }}>Cover Letter:</strong>
                          <p style={{ margin: '2px 0 0 0', fontStyle: 'italic', color: 'var(--text-main)' }}>"{book.coverLetter}"</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <span>📅 Reserved Date: <strong>{book.date}</strong></span>
                      <span>⏰ Time Slot: <strong>{book.time || 'To be confirmed'}</strong></span>
                    </>
                  )}
                </div>
                <span className="booking-card-price">
                  {book.itemType === 'Job' ? (
                    <span>Compensation rate: <strong>{book.price}</strong></span>
                  ) : (
                    <span>Total Invoiced: <strong>₹{typeof book.price === 'number' ? book.price.toLocaleString('en-IN') : book.price}</strong></span>
                  )}
                </span>
              </div>
              <div className="booking-card-right-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '10px' }}>
                <span className={`booking-status-tag-static status-${book.status}`} style={{
                  fontSize: '9px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: book.status === 'confirmed' ? 'rgba(0, 180, 100, 0.12)' : 
                                   book.status === 'pending' ? 'rgba(255, 165, 0, 0.12)' :
                                   book.status === 'cancelled' ? 'rgba(200, 16, 46, 0.12)' : 'var(--border)',
                  color: book.status === 'confirmed' ? '#00b464' : 
                         book.status === 'pending' ? '#ffa500' :
                         book.status === 'cancelled' ? '#C8102E' : 'var(--text-muted)'
                }}>
                  {book.status === 'pending' && book.itemType === 'Job' ? 'Applied' : book.status}
                </span>

                {(book.status === 'pending' || book.status === 'confirmed') && (currentRole === 'client' || currentRole === 'admin') && (
                  <button 
                    className="cancel-btn-action" 
                    onClick={() => updateBookingStatus(book.id, 'cancelled')}
                    style={{
                      background: 'none',
                      border: '1px solid var(--primary)',
                      color: 'var(--primary)',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {book.itemType === 'Job' ? 'Withdraw Application' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {currentUser && filteredBookings.length === 0 && (
        <div className="empty-bookings">
          <span className="empty-bookings-title">No bookings registered</span>
          <span className="empty-bookings-desc">You do not have any reservations under this tab. Head over to our catalog to select spaces or rent equipment.</span>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
