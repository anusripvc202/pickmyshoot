import React from 'react';
import { useAppContext } from '../context/AppContext';

const BookingsPage = () => {
  const {
    bookings,
    bookingFilter,
    setBookingFilter
  } = useAppContext();

  const filteredBookings = bookings.filter(b => 
    bookingFilter === 'upcoming' ? b.status === 'confirmed' : b.status === 'completed'
  );

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <span className="bookings-title">My Bookings Dashboard</span>
        
        <div className="bookings-tabs">
          <button 
            className={`booking-tab-btn ${bookingFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setBookingFilter('upcoming')}
          >
            Upcoming Bookings ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button 
            className={`booking-tab-btn ${bookingFilter === 'past' ? 'active' : ''}`}
            onClick={() => setBookingFilter('past')}
          >
            Completed ({bookings.filter(b => b.status === 'completed').length})
          </button>
        </div>
      </div>

      <div className="bookings-grid">
        {filteredBookings.map(book => (
          <div key={book.id} className="booking-card">
            <img src={book.item.image} className="booking-card-image" alt={book.item.title} />
            <div className="booking-card-info">
              <span className="booking-card-title">{book.item.title}</span>
              <div className="booking-card-details">
                <span>🏷️ Category: <strong>{book.itemType}</strong></span>
                <span>📅 Reserved Date: <strong>{book.date}</strong></span>
                <span>⏰ Time Slot: <strong>{book.time}</strong></span>
              </div>
              <span className="booking-card-price">Total Invoiced: <strong>₹{book.price.toLocaleString('en-IN')}</strong></span>
            </div>
            <span className={`booking-status-tag ${book.status}`}>
              {book.status}
            </span>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="empty-bookings">
          <span className="empty-bookings-title">No bookings registered</span>
          <span className="empty-bookings-desc">You do not have any upcoming reservations. Head over to our catalog to select spaces or rent equipment.</span>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
