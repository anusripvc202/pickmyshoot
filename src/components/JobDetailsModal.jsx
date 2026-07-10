import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Heart,
  Share2,
  Building2,
  Clock,
  Briefcase,
  Users,
  IndianRupee,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Calendar,
  Globe,
  Award,
  Zap
} from 'lucide-react';
import './JobDetailsModal.css';

/* ── Static enrichment data ── */
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80",
];

const SIMILAR_JOBS = [
  {
    title: "Wedding Photographer",
    company: "Moments Studio",
    salary: "₹35K–₹55K/mo",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=80&q=80"
  },
  {
    title: "Fashion Photographer",
    company: "Vogue Frames",
    salary: "₹40K–₹65K/mo",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=80&q=80"
  },
  {
    title: "Product Photographer",
    company: "BrandLens",
    salary: "₹30K–₹50K/mo",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&q=80"
  },
  {
    title: "Studio Assistant",
    company: "Light & Shade",
    salary: "₹15K–₹25K/mo",
    image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=80&q=80"
  }
];

const RESPONSIBILITIES = [
  "Conduct professional portrait and event photography sessions",
  "Edit and retouch photos using Adobe Lightroom & Photoshop",
  "Coordinate shoot logistics and client briefs",
  "Handle, maintain, and safeguard studio equipment",
  "Travel for outdoor and on-location shoots",
  "Deliver high-resolution final images within agreed timelines"
];

const QUALIFICATIONS = [
  "Bachelor's Degree in Photography or related field (Preferred)",
  "2–5 Years of proven professional experience",
  "Strong portfolio demonstrating work quality",
  "Professional client communication skills",
  "Proficiency in Adobe Creative Suite"
];

const BENEFITS = [
  { icon: "⏰", label: "Flexible Working Hours" },
  { icon: "🌴", label: "Paid Leave" },
  { icon: "🏆", label: "Performance Bonus" },
  { icon: "🏥", label: "Health Insurance" },
  { icon: "✈️", label: "Travel Allowance" },
  { icon: "📷", label: "Free Equipment Access" }
];

const JobDetailsModal = ({ job, onClose, onApply, likedItems, toggleLike }) => {
  const [activeThumb, setActiveThumb] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!job) return null;

  const isLiked = likedItems?.[job.id] || false;

  /* derive enrichment */
  const skills = job.skills || ['Photography', 'Portrait', 'Wedding', 'Adobe Lightroom', 'Photoshop', 'Studio Lighting', 'Client Communication', 'Color Grading'];
  const mainImage = GALLERY_IMAGES[activeThumb];
  const salary = typeof job.price === 'string' ? job.price : `₹${(job.price || 25000).toLocaleString('en-IN')}/Month`;
  const jobType = job.jobType || job.type || 'Full Time';
  const workplace = job.location === 'Remote' ? 'Remote' : 'On-site';
  const experience = job.experience || '2–5 Years';
  const company = job.company || 'PickMyShoot Studio';

  const handleApply = () => {
    setApplied(true);
    if (onApply) onApply();
  };

  if (applied) {
    return (
      <div className="jdm-overlay" onClick={onClose}>
        <div className="jdm-body" style={{ maxWidth: 480, maxHeight: 'auto' }} onClick={e => e.stopPropagation()}>
          <button className="jdm-close" onClick={onClose}><X size={16} /></button>
          <div className="jdm-success-view">
            <div className="jdm-success-icon">
              <CheckCircle size={36} color="#059669" />
            </div>
            <h3 className="jdm-success-title">Application Submitted! 🎉</h3>
            <p className="jdm-success-sub">
              Your application for <strong>{job.title}</strong> at <strong>{company}</strong> has been sent. The recruiter will reach out within 2–3 business days.
            </p>
            <button
              className="jdm-apply-btn"
              style={{ marginTop: 12 }}
              onClick={onClose}
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jdm-overlay" onClick={onClose}>
      <div className="jdm-body" onClick={e => e.stopPropagation()}>
        <button className="jdm-close" onClick={onClose}><X size={16} /></button>

        {/* Two-column layout inside a scrollable wrapper */}
        <div className="jdm-scroll">
          <div className="jdm-layout">

            {/* ══ LEFT — Gallery + Similar Jobs ══ */}
            <div className="jdm-gallery-col">
              {/* Main Image */}
              <div className="jdm-main-image-wrap">
                <img src={mainImage} className="jdm-main-img" alt="Company environment" />
                <span className="jdm-gallery-badge">📸 {activeThumb + 1} / {GALLERY_IMAGES.length} Photos</span>
              </div>

              {/* Thumbnails */}
              <div className="jdm-thumbnails">
                {GALLERY_IMAGES.map((img, idx) => (
                  <div
                    key={idx}
                    className={`jdm-thumb ${activeThumb === idx ? 'active' : ''}`}
                    onClick={() => setActiveThumb(idx)}
                  >
                    <img src={img} alt={`Studio ${idx + 1}`} />
                  </div>
                ))}
              </div>

              {/* Similar Jobs */}
              <div className="jdm-similar-section">
                <span className="jdm-section-label">Similar Openings</span>
                <div className="jdm-similar-cards">
                  {SIMILAR_JOBS.map((sj, idx) => (
                    <div key={idx} className="jdm-similar-card">
                      <div className="jdm-similar-icon">
                        <img src={sj.image} alt={sj.company} />
                      </div>
                      <div>
                        <span className="jdm-similar-title">{sj.title}</span>
                        <span className="jdm-similar-meta">{sj.company} • {sj.salary}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══ RIGHT — Job Information ══ */}
            <div className="jdm-info-col">

              {/* Header */}
              <div className="jdm-header">
                <img
                  src={job.image || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=80&q=80"}
                  className="jdm-company-logo"
                  alt={company}
                />
                <div className="jdm-header-text">
                  <h2 className="jdm-job-title">{job.title}</h2>

                  <div className="jdm-company-row">
                    <span className="jdm-company-name">{company}</span>
                    <span className="jdm-verified-badge">
                      <CheckCircle size={9} /> Verified
                    </span>
                  </div>

                  <div className="jdm-rating-row">
                    <Star size={11} fill="#f59e0b" color="#f59e0b" />
                    <span className="jdm-rating-num">{job.rating || '4.8'}</span>
                    <span>• {job.reviews || 250} Reviews</span>
                  </div>

                  <div className="jdm-meta-pills">
                    <span className="jdm-meta-pill">
                      <MapPin size={10} /> {job.location || 'Hyderabad'}
                    </span>
                    <span className="jdm-meta-pill">
                      <Calendar size={10} /> 2 days ago
                    </span>
                    <span className="jdm-meta-pill">
                      <Users size={10} /> 35 Applicants
                    </span>
                    <span className="jdm-meta-pill easy-apply">
                      <Zap size={10} /> Easy Apply
                    </span>
                    <span className="jdm-meta-pill hiring-now">
                      <CheckCircle size={10} /> Hiring Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="jdm-quick-grid">
                {[
                  { icon: <Building2 size={14} />, label: 'Company', val: company },
                  { icon: <Briefcase size={14} />, label: 'Employment Type', val: jobType },
                  { icon: <Globe size={14} />, label: 'Workplace', val: workplace },
                  { icon: <Award size={14} />, label: 'Experience', val: experience },
                  { icon: <IndianRupee size={14} />, label: 'Salary', val: salary.replace('/Month', '/mo').replace('/month', '/mo') },
                  { icon: <MapPin size={14} />, label: 'Location', val: job.location || 'Hyderabad' },
                  { icon: <Clock size={14} />, label: 'Shift Timing', val: '9 AM – 6 PM' },
                  { icon: <Users size={14} />, label: 'Team Size', val: '10–50 Employees' }
                ].map((qi, idx) => (
                  <div key={idx} className="jdm-quick-item">
                    <div className="jdm-qi-icon">{qi.icon}</div>
                    <div className="jdm-qi-text">
                      <span className="jdm-qi-label">{qi.label}</span>
                      <span className="jdm-qi-val">{qi.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* About the Role */}
              <div className="jdm-section">
                <h4 className="jdm-section-title">About the Role</h4>
                <p className="jdm-desc-text">
                  {showFullDesc || !job.description || job.description.length <= 160
                    ? (job.description || 'No description available.')
                    : `${job.description.slice(0, 160)}...`}
                </p>
                {job.description && job.description.length > 160 && (
                  <button className="jdm-read-more" onClick={() => setShowFullDesc(s => !s)}>
                    {showFullDesc
                      ? <><ChevronUp size={13} /> Read Less</>
                      : <><ChevronDown size={13} /> Read More</>}
                  </button>
                )}
              </div>

              {/* Responsibilities */}
              <div className="jdm-section">
                <h4 className="jdm-section-title">Responsibilities</h4>
                <div className="jdm-responsibilities">
                  {RESPONSIBILITIES.map((r, idx) => (
                    <div key={idx} className="jdm-responsibility-item">
                      <span className="jdm-resp-dot" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div className="jdm-section">
                <h4 className="jdm-section-title">Required Skills</h4>
                <div className="jdm-skills-wrap">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="jdm-skill-chip">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="jdm-section">
                <h4 className="jdm-section-title">Qualifications</h4>
                <div className="jdm-qual-list">
                  {QUALIFICATIONS.map((q, idx) => (
                    <div key={idx} className="jdm-qual-item">
                      <div className="jdm-qual-icon"><CheckCircle size={12} /></div>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="jdm-section">
                <h4 className="jdm-section-title">Benefits & Perks</h4>
                <div className="jdm-benefits-grid">
                  {BENEFITS.map((b, idx) => (
                    <div key={idx} className="jdm-benefit-card">
                      <div className="jdm-benefit-icon">{b.icon}</div>
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Insights */}
              <div className="jdm-section">
                <h4 className="jdm-section-title">Company Insights</h4>
                <div className="jdm-insights-grid">
                  {[
                    { val: job.rating || '4.8 ★', lbl: 'Rating' },
                    { val: '25–50', lbl: 'Employees' },
                    { val: '12', lbl: 'Active Jobs' },
                    { val: '2018', lbl: 'Founded' },
                    { val: '94%', lbl: 'Response Rate' },
                    { val: '~4 Days', lbl: 'Avg. Hire Time' }
                  ].map((ins, idx) => (
                    <div key={idx} className="jdm-insight-card">
                      <span className="jdm-insight-val">{ins.val}</span>
                      <span className="jdm-insight-lbl">{ins.lbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meet the Recruiter */}
              <div className="jdm-section">
                <h4 className="jdm-section-title">Meet the Recruiter</h4>
                <div className="jdm-recruiter-card">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                    className="jdm-recruiter-avatar"
                    alt="Recruiter"
                  />
                  <div className="jdm-recruiter-info">
                    <p className="jdm-recruiter-name">Priya Sharma</p>
                    <p className="jdm-recruiter-title">HR Manager — {company}</p>
                    <p className="jdm-recruiter-resp">⚡ Usually responds in under 24 hours</p>
                  </div>
                  <button className="jdm-msg-recruiter-btn">
                    <MessageSquare size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Message
                  </button>
                </div>
              </div>

              {/* Location Map */}
              <div className="jdm-section" style={{ borderBottom: 'none', paddingBottom: 80 }}>
                <h4 className="jdm-section-title">Office Location</h4>
                <div className="jdm-map-wrap">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15228.384661448651!2d78.39994326589308!3d17.407238260787167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb96df69cc2f67%3A0x6e9f5bb64c7e4cc4!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%" height="100%"
                    style={{ border: 0 }}
                    allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office location"
                  />
                </div>
                <div className="jdm-location-footer">
                  <div className="jdm-office-addr">
                    <MapPin size={13} color="#0a66c2" />
                    <span>{job.location && job.location !== 'Remote' ? `${job.location}` : 'Jubilee Hills, Hyderabad, TS 500033'}</span>
                  </div>
                  <button className="jdm-directions-btn">Get Directions →</button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ══ Sticky Bottom Bar ══ */}
        <div className="jdm-sticky-bar">
          <div className="jdm-bar-salary">
            <span className="jdm-bar-salary-val">{salary}</span>
            <span className="jdm-bar-salary-lbl">Salary Range</span>
          </div>

          <div className="jdm-bar-actions">
            <button
              className={`jdm-bar-icon-btn ${isLiked ? 'saved' : ''}`}
              title="Save Job"
              onClick={(e) => toggleLike && toggleLike(job.id, e)}
            >
              <Heart size={16} fill={isLiked ? '#e53935' : 'none'} />
            </button>

            <button
              className="jdm-bar-icon-btn"
              title="Share"
              onClick={() => navigator.share
                ? navigator.share({ title: job.title, text: `Check out this job: ${job.title} at ${company}` })
                : navigator.clipboard.writeText(window.location.href)
              }
            >
              <Share2 size={16} />
            </button>

            <button className="jdm-save-btn" onClick={(e) => toggleLike && toggleLike(job.id, e)}>
              {isLiked ? '✓ Saved' : 'Save Job'}
            </button>

            <button className="jdm-apply-btn" onClick={handleApply}>
              <Send size={14} /> Apply Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobDetailsModal;
