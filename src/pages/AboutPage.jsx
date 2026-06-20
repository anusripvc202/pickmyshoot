import React from 'react';
import { Camera, Heart, Users, MapPin } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="info-page-container">
      <div className="info-page-hero">
        <h1 className="info-page-title">Every Story Builds a Brand.</h1>
        <p className="info-page-subtitle">
          We are PickMyShoot, India's leading marketplace for creative professionals.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-text-content">
          <h2 className="section-title">Our Mission</h2>
          <p>
            At PickMyShoot, we believe that high-quality visual content shouldn't be hard to produce. 
            Whether you're an e-commerce brand looking for product photography, a couple planning their wedding, 
            or an agency needing top-tier models and studios, we connect you with verified, passionate creators.
          </p>
          <p>
            Founded in Hyderabad, we have expanded to serve thousands of creators and clients across the country, 
            providing a secure platform for booking shoots, renting professional gear, and securing the perfect location.
          </p>
          
          <h2 className="section-title" style={{ marginTop: '40px' }}>Why Choose Us?</h2>
          <div className="about-features">
            <div className="about-feature-item">
              <div className="icon-box"><Camera size={24} color="var(--primary)" /></div>
              <div>
                <h4>Curated Talent</h4>
                <p>Every photographer and model is verified for quality.</p>
              </div>
            </div>
            <div className="about-feature-item">
              <div className="icon-box"><MapPin size={24} color="var(--primary)" /></div>
              <div>
                <h4>Premium Spaces</h4>
                <p>From cycloramas to vintage lofts, find any studio.</p>
              </div>
            </div>
            <div className="about-feature-item">
              <div className="icon-box"><Heart size={24} color="var(--primary)" /></div>
              <div>
                <h4>Secure Payments</h4>
                <p>Your money is safe until the job is done perfectly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-image-grid">
          <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000" alt="Behind the scenes" className="about-img main-img" />
          <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=500" alt="Studio Setup" className="about-img sub-img" />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
