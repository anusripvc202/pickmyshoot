import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Heart, Share2, Building2, Clock, Briefcase,
  Users, IndianRupee, CheckCircle, ChevronDown, ChevronUp,
  MessageSquare, Send, Calendar, Globe, Award, Zap, ArrowLeft
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './JobDetailsPage.css';

/* ── Static enrichment ── */
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80",
];

const RESPONSIBILITIES = [
  "Conduct professional portrait and event photography sessions",
  "Edit and retouch photos using Adobe Lightroom & Photoshop",
  "Coordinate shoot logistics and client briefs",
  "Handle, maintain, and safeguard studio equipment",
  "Travel for outdoor and on-location shoots",
  "Deliver high-resolution final images within agreed timelines",
];

const QUALIFICATIONS = [
  "Bachelor's Degree in Photography or related field (Preferred)",
  "2–5 Years of proven professional experience",
  "Strong portfolio demonstrating work quality",
  "Professional client communication skills",
  "Proficiency in Adobe Creative Suite",
];

const BENEFITS = [
  { icon: "⏰", label: "Flexible Working Hours" },
  { icon: "🌴", label: "Paid Leave" },
  { icon: "🏆", label: "Performance Bonus" },
  { icon: "🏥", label: "Health Insurance" },
  { icon: "✈️", label: "Travel Allowance" },
  { icon: "📷", label: "Free Equipment Access" },
];

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    jobs, 
    likedItems, 
    toggleLike, 
    triggerToast, 
    isAuthenticated,
    activeProfileId,
    currentUser,
    setBookings
  } = useAppContext();

  const [activeThumb, setActiveThumb] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [applied, setApplied] = useState(false);

  /* ── Find job by id ── */
  const job = useMemo(() => {
    return jobs.find(j => j.id === id) || jobs[0];
  }, [jobs, id]);

  if (!job) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ color: '#374151', fontWeight: 800 }}>Job not found</h2>
        <button onClick={() => navigate('/explore')} style={{ marginTop: 16, padding: '10px 24px', background: '#0a66c2', color: '#fff', border: 'none', borderRadius: 99, fontWeight: 700, cursor: 'pointer' }}>
          ← Back to Jobs
        </button>
      </div>
    );
  }

  const isLiked = likedItems?.[job.id] || false;
  const skills = job.skills || ['Photography', 'Portrait', 'Wedding', 'Adobe Lightroom', 'Photoshop', 'Studio Lighting', 'Client Communication', 'Color Grading'];
  const mainImage = GALLERY_IMAGES[activeThumb];
  const salary = typeof job.price === 'string' ? job.price : `₹${(job.price || 25000).toLocaleString('en-IN')}/Month`;
  const jobType = job.jobType || job.type || 'Full Time';
  const workplace = job.location === 'Remote' ? 'Remote' : 'On-site';
  const company = job.company || 'PickMyShoot Studio';

  const handleApply = () => {
    if (!isAuthenticated) {
      triggerToast("Please log in to apply for jobs.");
      navigate('/login');
      return;
    }

    const employerId = job.ownerId || job.creatorId || "demo-admin";
    const applicantId = activeProfileId || (currentUser?.id || "demo-photographer");

    const dbBooking = {
      listingId: job.id || job._id || "",
      clientId: employerId,
      creatorId: applicantId,
      ownerId: applicantId,
      itemType: "Job",
      title: job.title || "",
      date: new Date().toLocaleDateString('en-IN'),
      time: "Anytime",
      price: job.price || "Contact for Quote",
      status: "pending",
      item: job,
      clientName: currentUser?.name || "Applicant",
      clientEmail: currentUser?.email || "",
      clientPhone: currentUser?.phone || ""
    };

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbBooking)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save job application");
        return res.json();
      })
      .then(savedBooking => {
        const mappedBooking = { 
          ...savedBooking, 
          id: savedBooking._id,
          ownerId: savedBooking.ownerId || savedBooking.creatorId
        };
        setBookings(prev => [mappedBooking, ...prev]);
        setApplied(true);
        triggerToast(`Application submitted for "${job.title}"!`);
      })
      .catch(err => {
        console.warn("Failed to sync application to DB, saving locally:", err);
        const localBooking = { 
          id: `b-${Date.now()}`, 
          ...dbBooking,
          ownerId: dbBooking.ownerId || dbBooking.creatorId
        };
        setBookings(prev => [localBooking, ...prev]);
        setApplied(true);
        triggerToast(`Application submitted locally for "${job.title}"!`);
      });
  };

  /* ── Right column: apply card ── */
  const ApplyCard = () => (
    applied ? (
      <div className="jdp-success-card">
        <div className="jdp-success-icon">
          <CheckCircle size={36} color="#059669" />
        </div>
        <h3 className="jdp-success-title">Application Sent! 🎉</h3>
        <p className="jdp-success-sub">
          Your application for <strong>{job.title}</strong> at <strong>{company}</strong> was submitted. The recruiter will contact you within 2–3 business days.
        </p>
        <button className="jdp-apply-btn" style={{ marginTop: 4 }} onClick={() => navigate('/explore')}>
          Browse More Jobs
        </button>
      </div>
    ) : (
      <div className="jdp-apply-card">
        <div className="jdp-salary-row">
          <span className="jdp-salary-val">{salary}</span>
          <span className="jdp-salary-lbl">Salary Range</span>
        </div>

        <button className="jdp-apply-btn" onClick={handleApply}>
          <Send size={15} /> Apply Now
        </button>

        <div className="jdp-action-row">
          <button
            className={`jdp-save-btn ${isLiked ? 'saved' : ''}`}
            onClick={(e) => toggleLike(job.id, e)}
          >
            <Heart size={14} fill={isLiked ? '#e53935' : 'none'} />
            {isLiked ? 'Saved' : 'Save Job'}
          </button>
          <button className="jdp-share-btn" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            triggerToast("Job link copied!");
          }}>
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>
    )
  );

  return (
    <div className="jdp-container">
      {/* Breadcrumb */}
      <div className="jdp-breadcrumb">
        <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</a>
        <span>›</span>
        <a onClick={() => { navigate('/explore'); }} style={{ cursor: 'pointer' }}>Jobs & Gigs</a>
        <span>›</span>
        <span>{job.title}</span>
      </div>

      <div className="jdp-layout">
        {/* ══════════════ LEFT ══════════════ */}
        <div className="jdp-left">

          {/* Header Card */}
          <div className="jdp-header-card">
            <div className="jdp-header-top">
              <img
                src={job.image || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=100&q=80"}
                className="jdp-company-logo"
                alt={company}
              />
              <div className="jdp-header-text">
                <h1 className="jdp-job-title">{job.title}</h1>

                <div className="jdp-company-row">
                  <span className="jdp-company-name">{company}</span>
                  <span className="jdp-verified-badge">
                    <CheckCircle size={10} /> Verified Employer
                  </span>
                </div>

                <div className="jdp-rating-row">
                  <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  <span className="jdp-rating-num">{job.rating || '4.8'}</span>
                  <span>• {job.reviews || 250} Reviews</span>
                </div>

                <div className="jdp-meta-pills">
                  <span className="jdp-meta-pill"><MapPin size={11} /> {job.location || 'Hyderabad'}</span>
                  <span className="jdp-meta-pill"><Calendar size={11} /> 2 days ago</span>
                  <span className="jdp-meta-pill"><Users size={11} /> 35 Applicants</span>
                  <span className="jdp-meta-pill easy-apply"><Zap size={11} /> Easy Apply</span>
                  <span className="jdp-meta-pill hiring-now"><CheckCircle size={11} /> Hiring Now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="jdp-gallery-card">
            <div className="jdp-main-image-wrap">
              <img src={mainImage} className="jdp-main-img" alt="Work environment" />
              <span className="jdp-gallery-badge">📸 {activeThumb + 1} / {GALLERY_IMAGES.length} Photos</span>
            </div>
            <div className="jdp-thumbnails">
              {GALLERY_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  className={`jdp-thumb ${activeThumb === idx ? 'active' : ''}`}
                  onClick={() => setActiveThumb(idx)}
                >
                  <img src={img} alt={`Studio ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="jdp-section-card">
            <h3 className="jdp-section-title">Job Details</h3>
            <div className="jdp-quick-grid">
              {[
                { icon: <Building2 size={15} />, label: 'Company',         val: company },
                { icon: <Briefcase  size={15} />, label: 'Employment Type', val: jobType },
                { icon: <Globe      size={15} />, label: 'Workplace',       val: workplace },
                { icon: <Award      size={15} />, label: 'Experience',      val: '2–5 Years' },
                { icon: <IndianRupee size={15}/>, label: 'Salary',          val: salary },
                { icon: <MapPin     size={15} />, label: 'Location',        val: job.location || 'Hyderabad' },
                { icon: <Clock      size={15} />, label: 'Shift Timing',    val: '9 AM – 6 PM' },
                { icon: <Users      size={15} />, label: 'Team Size',       val: '10–50 Employees' },
              ].map((qi, idx) => (
                <div key={idx} className="jdp-quick-item">
                  <div className="jdp-qi-icon">{qi.icon}</div>
                  <div className="jdp-qi-text">
                    <span className="jdp-qi-label">{qi.label}</span>
                    <span className="jdp-qi-val">{qi.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About the Role */}
          <div className="jdp-section-card">
            <h3 className="jdp-section-title">About the Role</h3>
            <p className="jdp-desc-text">
              {showFullDesc || !job.description || job.description.length <= 220
                ? (job.description || 'No description available.')
                : `${job.description.slice(0, 220)}...`}
            </p>
            {job.description && job.description.length > 220 && (
              <button className="jdp-read-more" onClick={() => setShowFullDesc(s => !s)}>
                {showFullDesc ? <><ChevronUp size={13} /> Read Less</> : <><ChevronDown size={13} /> Read More</>}
              </button>
            )}
          </div>

          {/* Responsibilities */}
          <div className="jdp-section-card">
            <h3 className="jdp-section-title">Responsibilities</h3>
            <div className="jdp-responsibilities">
              {RESPONSIBILITIES.map((r, idx) => (
                <div key={idx} className="jdp-resp-item">
                  <span className="jdp-resp-dot" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div className="jdp-section-card">
            <h3 className="jdp-section-title">Required Skills</h3>
            <div className="jdp-skills-wrap">
              {skills.map((skill, idx) => (
                <span key={idx} className="jdp-skill-chip">{skill}</span>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className="jdp-section-card">
            <h3 className="jdp-section-title">Qualifications</h3>
            <div className="jdp-qual-list">
              {QUALIFICATIONS.map((q, idx) => (
                <div key={idx} className="jdp-qual-item">
                  <div className="jdp-qual-icon"><CheckCircle size={13} /></div>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="jdp-section-card">
            <h3 className="jdp-section-title">Benefits & Perks</h3>
            <div className="jdp-benefits-grid">
              {BENEFITS.map((b, idx) => (
                <div key={idx} className="jdp-benefit-card">
                  <div className="jdp-benefit-icon">{b.icon}</div>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company Insights */}
          <div className="jdp-section-card">
            <h3 className="jdp-section-title">Company Insights</h3>
            <div className="jdp-insights-grid">
              {[
                { val: job.rating || '4.8 ★', lbl: 'Rating' },
                { val: '25–50', lbl: 'Employees' },
                { val: '12', lbl: 'Active Jobs' },
                { val: '2018', lbl: 'Founded' },
                { val: '94%', lbl: 'Response Rate' },
                { val: '~4 Days', lbl: 'Avg. Hire Time' },
              ].map((ins, idx) => (
                <div key={idx} className="jdp-insight-card">
                  <span className="jdp-insight-val">{ins.val}</span>
                  <span className="jdp-insight-lbl">{ins.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter */}
          <div className="jdp-section-card">
            <h3 className="jdp-section-title">Meet the Recruiter</h3>
            <div className="jdp-recruiter-card">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                className="jdp-recruiter-avatar"
                alt="Recruiter"
              />
              <div className="jdp-recruiter-info">
                <p className="jdp-recruiter-name">Priya Sharma</p>
                <p className="jdp-recruiter-title">HR Manager — {company}</p>
                <p className="jdp-recruiter-resp">⚡ Usually responds within 24 hours</p>
              </div>
              <button className="jdp-msg-btn" onClick={() => triggerToast("Message feature coming soon!")}>
                <MessageSquare size={13} /> Message
              </button>
            </div>
          </div>

          {/* Location Map */}
          <div className="jdp-section-card">
            <h3 className="jdp-section-title">Office Location</h3>
            <div className="jdp-map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15228.384661448651!2d78.39994326589308!3d17.407238260787167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb96df69cc2f67%3A0x6e9f5bb64c7e4cc4!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office location"
              />
            </div>
            <div className="jdp-location-footer">
              <div className="jdp-office-addr">
                <MapPin size={14} color="#0a66c2" />
                <span>{job.location && job.location !== 'Remote' ? job.location : 'Jubilee Hills, Hyderabad, TS 500033'}</span>
              </div>
              <button className="jdp-directions-btn" onClick={() => window.open('https://maps.google.com', '_blank')}>
                Get Directions →
              </button>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="jdp-section-card">
            <h3 className="jdp-section-title">Similar Openings</h3>
            <div className="jdp-similar-list">
              {jobs.filter(j => j.id !== job.id).slice(0, 4).map((sj) => (
                <div 
                  key={sj.id} 
                  className="jdp-similar-card"
                  onClick={() => {
                    navigate(`/job/${sj.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="jdp-similar-icon">
                    <img src={sj.image} alt={sj.company} />
                  </div>
                  <div>
                    <span className="jdp-similar-title">{sj.title}</span>
                    <span className="jdp-similar-meta">{sj.company} • {sj.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ══════════════ RIGHT — Sticky Apply ══════════════ */}
        <div className="jdp-right">
          <ApplyCard />
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="jdp-mobile-bar">
        <div className="jdp-mobile-bar-inner">
          <div className="jdp-mobile-salary">
            <span className="jdp-mobile-salary-val">{salary}</span>
            <span className="jdp-mobile-salary-lbl">Salary Range</span>
          </div>
          <div className="jdp-mobile-actions">
            <button className="jdp-mobile-icon-btn" onClick={(e) => toggleLike(job.id, e)}>
              <Heart size={16} fill={isLiked ? '#e53935' : 'none'} color={isLiked ? '#e53935' : 'currentColor'} />
            </button>
            <button className="jdp-mobile-icon-btn" onClick={() => { navigator.clipboard.writeText(window.location.href); triggerToast("Link copied!"); }}>
              <Share2 size={16} />
            </button>
            <button className="jdp-mobile-apply-btn" onClick={handleApply}>Apply Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
