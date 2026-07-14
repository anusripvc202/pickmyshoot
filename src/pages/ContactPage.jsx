import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './ContactPage.css';

const ContactPage = () => {
  const { triggerToast } = useAppContext();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerToast("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        triggerToast(data.error || data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      triggerToast("Error sending message. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="info-page-container">
      <div className="info-page-hero" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="info-page-title">Get in Touch</h1>
        <p className="info-page-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Have a question about a booking, need technical support, or want to partner with us? We're here to help.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-cards">
          <div className="contact-card">
            <div className="icon-circle"><Mail size={24} color="var(--primary)" /></div>
            <h3>Email Us</h3>
            <p>hello@pickmyshoot.in</p>
            <p>support@pickmyshoot.in</p>
          </div>
          <div className="contact-card">
            <div className="icon-circle"><Phone size={24} color="var(--primary)" /></div>
            <h3>Call Us</h3>
            <p>+91 98765 43210</p>
            <p>Mon - Fri, 9am - 6pm</p>
          </div>
          <div className="contact-card">
            <div className="icon-circle"><MapPin size={24} color="var(--primary)" /></div>
            <h3>Visit HQ</h3>
            <p>Creative Hub, Jubilee Hills</p>
            <p>Hyderabad, TS 500033</p>
          </div>
        </div>

        <form className="contact-form glass-panel" onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: '20px' }}>Send a Message</h2>
          <div className="form-group-row">
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Jane Doe" 
              />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                placeholder="jane@example.com" 
              />
            </div>
          </div>
          <div className="input-group">
            <label>Subject</label>
            <input 
              type="text" 
              required 
              value={formData.subject} 
              onChange={e => setFormData({...formData, subject: e.target.value})} 
              placeholder="How can we help?" 
            />
          </div>
          <div className="input-group">
            <label>Message</label>
            <textarea 
              rows="5" 
              required 
              value={formData.message} 
              onChange={e => setFormData({...formData, message: e.target.value})} 
              placeholder="Write your message here..." 
            ></textarea>
          </div>
          <button type="submit" className="primary-btn submit-contact-btn" disabled={isSubmitting}>
            <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
            {isSubmitting ? <span className="spinner-mini"></span> : <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
