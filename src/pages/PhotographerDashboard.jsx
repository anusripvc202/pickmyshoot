import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  MapPin, 
  Award,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  Clock,
  Grid,
  Trash2,
  X,
  Upload,
  Camera,
  Plus,
  Mail,
  Send,
  Calendar,
  FileText,
  Lock,
  CheckCircle,
  LogOut,
  ArrowLeft,
  Shield
} from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const PhotographerDashboard = () => {
  const {
    bookings,
    services,
    gear,
    studios,
    triggerToast,
    profiles,
    setProfiles,
    activeProfileId,
    setActiveProfileId,
    toggleListingActive,
    updateBookingStatus,
    addPortfolioItem,
    portfolioItems,
    chatSessions,
    chatMessages,
    sendChatMessage,
    currentUser,
    logoutUser
  } = useAppContext();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Setup fallback constants
  const startingPriceFallback = activeProfile.startingPrice || 1800;
  const experienceFallback = activeProfile.experience || 3;
  const ratingFallback = activeProfile.rating || "4.9 ★";
  const reviewsFallback = activeProfile.reviews || 42;
  const cityFallback = activeProfile.city || "Hyderabad";
  const areaFallback = activeProfile.area || "Jubilee Hills";
  const categoriesFallback = activeProfile.categories || ["Wedding Photography", "Candid Photography"];
  const highlightsFallback = activeProfile.highlights || ["1+ Year Experience", "Creative Angles", "High-End Camera Equipment"];
  const languagesFallback = activeProfile.languages || ["English", "Hindi", "Telugu"];
  const travelOutsideFallback = activeProfile.travelOutside || "Yes";
  const pmsIdFallback = activeProfile.pmsId || `PMSHYD${activeProfile.id ? activeProfile.id.slice(-6).toUpperCase() : '000007'}`;
  
  const gmbUrlFallback = activeProfile.gmbUrl || "";
  const instaUrlFallback = activeProfile.instaUrl || "https://instagram.com/pickmyshoot";
  const fbUrlFallback = activeProfile.fbUrl || "";
  const webUrlFallback = activeProfile.webUrl || "";

  // Local state for profile inputs in settings
  const [profileName, setProfileName] = useState(activeProfile.name);
  const [profileEmail, setProfileEmail] = useState(activeProfile.email);
  const [profileBio, setProfileBio] = useState(activeProfile.bio);

  const [profileStartingPrice, setProfileStartingPrice] = useState(startingPriceFallback);
  const [profileExperience, setProfileExperience] = useState(experienceFallback);
  const [profileRating, setProfileRating] = useState(ratingFallback);
  const [profileReviews, setProfileReviews] = useState(reviewsFallback);
  const [profileCity, setProfileCity] = useState(cityFallback);
  const [profileLocation, setProfileLocation] = useState(areaFallback);
  const [selectedCategories, setSelectedCategories] = useState(categoriesFallback);
  const [profileHighlights, setProfileHighlights] = useState(highlightsFallback.join(", "));
  const [profileLanguages, setProfileLanguages] = useState(languagesFallback.join(", "));
  const [profileTravelOutside, setProfileTravelOutside] = useState(travelOutsideFallback);

  const [profileGmbUrl, setProfileGmbUrl] = useState(gmbUrlFallback);
  const [profileInstaUrl, setProfileInstaUrl] = useState(instaUrlFallback);
  const [profileFbUrl, setProfileFbUrl] = useState(fbUrlFallback);
  const [profileWebUrl, setProfileWebUrl] = useState(webUrlFallback);

  // Sync settings form inputs when active profile changes
  useEffect(() => {
    setProfileName(activeProfile.name);
    setProfileEmail(activeProfile.email);
    setProfileBio(activeProfile.bio);
    setProfileStartingPrice(activeProfile.startingPrice || 1800);
    setProfileExperience(activeProfile.experience || 3);
    setProfileRating(activeProfile.rating || "4.9 ★");
    setProfileReviews(activeProfile.reviews || 42);
    setProfileCity(activeProfile.city || "Hyderabad");
    setProfileLocation(activeProfile.area || "Jubilee Hills");
    setSelectedCategories(activeProfile.categories || ["Wedding Photography", "Candid Photography"]);
    setProfileHighlights((activeProfile.highlights || ["1+ Year Experience", "Creative Angles", "High-End Camera Equipment"]).join(", "));
    setProfileLanguages((activeProfile.languages || ["English", "Hindi", "Telugu"]).join(", "));
    setProfileTravelOutside(activeProfile.travelOutside || "Yes");
    setProfileGmbUrl(activeProfile.gmbUrl || "");
    setProfileInstaUrl(activeProfile.instaUrl || "https://instagram.com/pickmyshoot");
    setProfileFbUrl(activeProfile.fbUrl || "");
    setProfileWebUrl(activeProfile.webUrl || "");
    setIsVerified(!!activeProfile.isVerified);
  }, [activeProfileId, activeProfile]);

  // Packages Pricing Form state
  const initialPackages = activeProfile.packages || {
    essential: { price: 4500, hours: 3, photographers: 1 },
    premium: { price: 9500, hours: 6, photographers: 2 },
    luxury: { price: 18000, hours: 12, photographers: 3 }
  };
  const [essentialPrice, setEssentialPrice] = useState(initialPackages.essential.price);
  const [essentialHours, setEssentialHours] = useState(initialPackages.essential.hours);
  const [essentialPhotographers, setEssentialPhotographers] = useState(initialPackages.essential.photographers);

  const [premiumPrice, setPremiumPrice] = useState(initialPackages.premium.price);
  const [premiumHours, setPremiumHours] = useState(initialPackages.premium.hours);
  const [premiumPhotographers, setPremiumPhotographers] = useState(initialPackages.premium.photographers);

  const [luxuryPrice, setLuxuryPrice] = useState(initialPackages.luxury.price);
  const [luxuryHours, setLuxuryHours] = useState(initialPackages.luxury.hours);
  const [luxuryPhotographers, setLuxuryPhotographers] = useState(initialPackages.luxury.photographers);

  // Sync packages state when active profile changes
  useEffect(() => {
    const pkgs = activeProfile.packages || {
      essential: { price: 4500, hours: 3, photographers: 1 },
      premium: { price: 9500, hours: 6, photographers: 2 },
      luxury: { price: 18000, hours: 12, photographers: 3 }
    };
    setEssentialPrice(pkgs.essential.price);
    setEssentialHours(pkgs.essential.hours);
    setEssentialPhotographers(pkgs.essential.photographers);
    setPremiumPrice(pkgs.premium.price);
    setPremiumHours(pkgs.premium.hours);
    setPremiumPhotographers(pkgs.premium.photographers);
    setLuxuryPrice(pkgs.luxury.price);
    setLuxuryHours(pkgs.luxury.hours);
    setLuxuryPhotographers(pkgs.luxury.photographers);
  }, [activeProfileId, activeProfile]);

  // Inquiries
  const inquiries = activeProfile.inquiries || [
    { id: "inq-1", clientName: "Harish Kumar", phone: "+91 98765 43210", date: "2026-07-15", category: "Pre Wedding Shoot", message: "Looking for an outdoor pre-wedding couple shoot in Jubilee Hills." },
    { id: "inq-2", clientName: "Deepika Reddy", phone: "+91 91234 56789", date: "2026-08-02", category: "Wedding Photography", message: "Wedding photography requirements for 2 days event." }
  ];

  // Portfolio image upload modal state
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [pfTitle, setPfTitle] = useState('');
  const [pfCategory, setPfCategory] = useState('Western / Editorial');
  const [pfImage, setPfImage] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80');

  // Add Profile Modal states
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileType, setNewProfileType] = useState('Photographer');
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfilePrice, setNewProfilePrice] = useState(1500);

  // Public Profile Preview Modal
  const [showPublicProfileModal, setShowPublicProfileModal] = useState(false);

  // Send Inquiry Modal inside Public Preview
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState('Wedding Photography');
  const [inquiryMessage, setInquiryMessage] = useState('');

  // Chat window states
  const [selectedSessionId, setSelectedSessionId] = useState('ch-1');
  const [chatInputText, setChatInputText] = useState('');

  // Calendar Availability states
  const [blockedDates, setBlockedDates] = useState(['2026-06-22', '2026-06-25']);
  const [workingHoursStart, setWorkingHoursStart] = useState('09:00 AM');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('06:00 PM');
  const [newBlockedDate, setNewBlockedDate] = useState('');

  // Invoice generator states
  const [selectedInvoiceBookingId, setSelectedInvoiceBookingId] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('Thank you for choosing PickMyShoot! We look forward to working together.');
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  // Partner Verification states
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState(null);
  const [isVerified, setIsVerified] = useState(!!(activeProfile.isVerified));
 
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!verifyCode.trim()) {
      setVerifyMessage({ type: 'error', text: 'Please enter your verification code.' });
      return;
    }
    setVerifyLoading(true);
    setVerifyMessage(null);
    try {
      const res = await fetch('/api/verify-photographer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: activeProfile.email || currentUser?.email, code: verifyCode.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsVerified(true);
        setProfiles(prev => prev.map(p => p.id === activeProfileId ? { ...p, isVerified: true } : p));
        setVerifyMessage({ type: 'success', text: data.message || 'Profile verified successfully!' });
        triggerToast('✓ Profile verified! You are now a verified PickMyShoot partner.');
      } else {
        setVerifyMessage({ type: 'error', text: data.error || 'Verification failed. Please try again.' });
      }
    } catch (err) {
      setVerifyMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setVerifyLoading(false);
    }
  };



  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    sendChatMessage(selectedSessionId, chatInputText.trim());
    setChatInputText('');
  };

  const handleAddBlockedDate = (e) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    if (blockedDates.includes(newBlockedDate)) {
      triggerToast("Date is already blocked!");
      return;
    }
    setBlockedDates(prev => [...prev, newBlockedDate]);
    setNewBlockedDate('');
    triggerToast("Availability calendar updated! Date blocked.");
  };

  const handleRemoveBlockedDate = (date) => {
    setBlockedDates(prev => prev.filter(d => d !== date));
    triggerToast("Date unblocked! Available for bookings.");
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...activeProfile,
      name: profileName,
      email: profileEmail,
      bio: profileBio,
      startingPrice: parseInt(profileStartingPrice) || 1800,
      experience: parseInt(profileExperience) || 3,
      rating: profileRating,
      reviews: parseInt(profileReviews) || 0,
      area: profileLocation,
      city: profileCity,
      categories: selectedCategories,
      highlights: profileHighlights.split(",").map(s => s.trim()).filter(Boolean),
      languages: profileLanguages.split(",").map(s => s.trim()).filter(Boolean),
      travelOutside: profileTravelOutside,
      gmbUrl: profileGmbUrl,
      instaUrl: profileInstaUrl,
      fbUrl: profileFbUrl,
      webUrl: profileWebUrl
    };

    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        return updatedProfile;
      }
      return p;
    }));

    // Trigger toast
    triggerToast("✓ Profile settings updated successfully!");
  };

  const handlePackagesUpdate = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...activeProfile,
      packages: {
        essential: { price: parseInt(essentialPrice) || 0, hours: parseInt(essentialHours) || 0, photographers: parseInt(essentialPhotographers) || 1 },
        premium: { price: parseInt(premiumPrice) || 0, hours: parseInt(premiumHours) || 0, photographers: parseInt(premiumPhotographers) || 1 },
        luxury: { price: parseInt(luxuryPrice) || 0, hours: parseInt(luxuryHours) || 0, photographers: parseInt(luxuryPhotographers) || 1 }
      }
    };
    
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        return updatedProfile;
      }
      return p;
    }));
    
    triggerToast("✓ Packages pricing configured successfully!");
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) {
      triggerToast("Please enter a profile name!");
      return;
    }
    const newId = `prof-${Date.now()}`;
    const newProfileObj = {
      id: newId,
      name: newProfileName.trim(),
      role: 'photographer',
      email: `${newProfileName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      avatar: newProfileType === 'Studio Profile' 
        ? 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=100&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      bio: `Professional ${newProfileType.toLowerCase()} ready for bookings.`,
      location: 'Hyderabad, TS',
      phone: '+91 99999 00000',
      isVerified: false,
      startingPrice: parseInt(newProfilePrice) || 1500,
      experience: 1,
      rating: "5.0 ★",
      reviews: 0,
      city: "Hyderabad",
      area: "Jubilee Hills",
      categories: ["Wedding Photography"],
      highlights: ["Newly Created Profile"],
      languages: ["English"],
      travelOutside: "Yes"
    };

    setProfiles(prev => [...prev, newProfileObj]);
    setActiveProfileId(newId);
    setShowAddProfileModal(false);
    setNewProfileName('');
    triggerToast(`✓ Profile "${newProfileName}" created successfully!`);

    // Sync new profile to MongoDB
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfileObj)
    })
      .then(res => res.json())
      .then(saved => console.log('Successfully synced new profile to DB:', saved))
      .catch(err => console.warn('Failed to sync new profile to DB:', err));
  };

  const handleToggleCategory = (cat) => {
    setSelectedCategories(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const toggleDateBlocked = (dateStr) => {
    if (blockedDates.includes(dateStr)) {
      setBlockedDates(prev => prev.filter(d => d !== dateStr));
      triggerToast(`Slot ${dateStr} is now Open`);
    } else {
      setBlockedDates(prev => [...prev, dateStr]);
      triggerToast(`Slot ${dateStr} is now Blocked`);
    }
  };

  const getNext30Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;
      dates.push({
        dateString,
        formatted: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return dates;
  };

  const loadPresetGallery = (presetName) => {
    const presets = {
      "Wedding Showcase": [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
      ],
      "Pre-Wedding Magic": [
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80"
      ],
      "Candid Romance": [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?auto=format&fit=crop&w=600&q=80"
      ],
      "Maternity Elegance": [
        "https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1551250936-2640fffc7021?auto=format&fit=crop&w=600&q=80"
      ],
      "Baby Laugh": [
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80"
      ],
      "Commercial Shoot": [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
      ]
    };
    const urls = presets[presetName] || [];
    urls.forEach((url, i) => {
      addPortfolioItem({
        title: `${presetName} Item ${i + 1}`,
        category: pfCategory,
        image: url
      });
    });
    triggerToast(`✓ Loaded preset "${presetName}" items into gallery!`);
  };

  const handleSendInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) {
      triggerToast("Please provide your name and phone number.");
      return;
    }
    const newInq = {
      id: `inq-${Date.now()}`,
      clientName: inquiryName,
      phone: inquiryPhone,
      date: inquiryDate || "2026-07-20",
      category: inquiryCategory,
      message: inquiryMessage || "No comments."
    };
    
    // Save to activeProfile inquiries
    const currentInquiries = activeProfile.inquiries || [
      { id: "inq-1", clientName: "Harish Kumar", phone: "+91 98765 43210", date: "2026-07-15", category: "Pre Wedding Shoot", message: "Looking for an outdoor pre-wedding couple shoot in Jubilee Hills." },
      { id: "inq-2", clientName: "Deepika Reddy", phone: "+91 91234 56789", date: "2026-08-02", category: "Wedding Photography", message: "Wedding photography requirements for 2 days event." }
    ];
    
    const updatedProfile = {
      ...activeProfile,
      inquiries: [newInq, ...currentInquiries]
    };

    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        return updatedProfile;
      }
      return p;
    }));

    setShowInquiryModal(false);
    setInquiryName('');
    setInquiryPhone('');
    setInquiryMessage('');
    triggerToast("✓ Client inquiry submitted successfully!");
  };

  const handleAddPortfolioSubmit = (e) => {
    e.preventDefault();
    if (!pfTitle) {
      triggerToast("Please provide a title");
      return;
    }
    addPortfolioItem({
      title: pfTitle,
      category: pfCategory,
      image: pfImage
    });
    setShowPortfolioModal(false);
    setPfTitle('');
  };

  // Photographer filtering & data
  const photographerBookings = bookings.filter(b => {
    const matchesActive = b.ownerId === activeProfileId || b.creatorId === activeProfileId;
    const matchesUser = currentUser && (
      b.ownerId === currentUser.id || 
      b.ownerId === currentUser._id || 
      b.creatorId === currentUser.id || 
      b.creatorId === currentUser._id
    );
    
    // Fallback for default mock bookings (prof-photographer, prof-1) to show up under primary photographer Nikhil
    const isNikhil = activeProfile?.email === 'nikhiljai1215@gmail.com' || activeProfileId === '6a380b8173c0e340a6bf3a42';
    const matchesMock = isNikhil && (
      b.ownerId === 'prof-photographer' || 
      b.creatorId === 'prof-photographer' || 
      b.ownerId === 'prof-1' || 
      b.creatorId === 'prof-1'
    );
    
    return matchesActive || matchesUser || matchesMock;
  });
  
  const photographerEarnings = photographerBookings.reduce((sum, b) => {
    const priceVal = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
    return sum + (b.status === 'confirmed' || b.status === 'completed' || b.status === 'approved' ? priceVal : 0);
  }, 0);

  const photographerOwnedListings = [
    ...services.filter(s => s.ownerId === activeProfileId || (!s.ownerId && activeProfileId === "prof-photographer" && (s.id === "ps-1" || s.id === "ps-9"))).map(s => ({ ...s, type: "Service Package", categoryKey: "service" })),
    ...gear.filter(g => g.ownerId === activeProfileId || (!g.ownerId && activeProfileId === "prof-photographer" && (g.id === "gr-1" || g.id === "gr-6"))).map(g => ({ ...g, type: "Gear Rental", categoryKey: "gear" })),
    ...studios.filter(st => st.ownerId === activeProfileId).map(st => ({ ...st, type: "Studio Space", categoryKey: "studio" }))
  ];

  // For invoice calculations
  const invoiceSelectedBooking = photographerBookings.find(b => b.id === selectedInvoiceBookingId);
  const baseInvoiceAmt = invoiceSelectedBooking ? (typeof invoiceSelectedBooking.price === 'number' ? invoiceSelectedBooking.price : parseFloat(invoiceSelectedBooking.price) || 0) : 0;
  const discountAmt = Math.round(baseInvoiceAmt * (invoiceDiscount / 100));
  const finalInvoiceAmt = baseInvoiceAmt - discountAmt;

  return (
    <div className="admin-console-page">
      
      {/* 2. Subheader Dark System Toolbar with Horizontal Tab Navigation */}
      <div className="admin-console-toolbar">
        <div className="toolbar-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Active Profile Switcher Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#aaa' }}>Profile:</span>
            <select
              value={activeProfileId || activeProfile.id}
              onChange={e => {
                setActiveProfileId(e.target.value);
                triggerToast(`Switched profile view!`);
              }}
              style={{
                background: '#222',
                color: 'white',
                border: '1px solid #444',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {profiles.filter(p => p.role === 'photographer' || p.role === 'admin').map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button 
              onClick={() => setShowAddProfileModal(true)}
              style={{
                background: '#c7100d',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Plus size={12} /> Add
            </button>
          </div>

          <button className={`toolbar-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>overview</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>bookings</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>catalog</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>packages</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>gallery</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>schedule</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>invoices</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>messages</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>settings</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'verification' ? 'active' : ''}`} onClick={() => setActiveTab('verification')}>
            verify {isVerified && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#27ae60', display: 'inline-block', marginLeft: 4, verticalAlign: 'middle' }} />}
          </button>

          <span className="toolbar-sep">|</span>
          <button className="toolbar-btn" onClick={() => { logoutUser(); navigate('/'); }}>
            <LogOut size={12} style={{ marginRight: '4px' }} />
            logout
          </button>
        </div>
        <div className="toolbar-right">
          <span className="superadmin-access-badge" style={{ color: '#ffb81c' }}>
            <Camera size={13} style={{ marginRight: '4px' }} />
            PHOTOGRAPHER ACCESS
          </span>
        </div>
      </div>

      {/* 3. Title Card */}
      <div className="console-title-card">
        <h2 className="console-main-title">PickMyShoot Photographer Partner Console</h2>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '6px', fontSize: '13.5px' }}>
          <span className="console-role-desc">
            <strong>Partner ID:</strong> {pmsIdFallback} | {activeProfile.name} ({activeProfile.email})
          </span>
          <span style={{ color: '#666' }}>•</span>
          <button 
            onClick={() => setShowPublicProfileModal(true)} 
            style={{ background: 'none', border: 'none', color: '#ffb81c', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontWeight: 700 }}
          >
            View Public Profile
          </button>
        </div>
      </div>

      {/* 4. Full-width KPI Overview Cards */}
      <section className="console-section" style={{ border: 'none', background: 'transparent', boxShadow: 'none', margin: '24px 24px 0 24px' }}>
        <div className="console-section-body overview-kpi-container" style={{ padding: 0 }}>
          <div className="overview-kpi-card border-dashed-red">
            <span className="kpi-number text-red">{photographerBookings.length}</span>
            <span className="kpi-label">TOTAL RESERVED GIGS</span>
          </div>
          <div className="overview-kpi-card border-dashed-green bg-green-light">
            <span className="kpi-number text-green">{photographerOwnedListings.length}</span>
            <span className="kpi-label">ACTIVE CATALOG ITEMS</span>
          </div>
          <div className="overview-kpi-card border-dashed-red">
            <span className="kpi-number text-dark">₹{photographerEarnings.toLocaleString('en-IN')}</span>
            <span className="kpi-label">TOTAL NET EARNINGS</span>
          </div>
        </div>
      </section>

      {/* 5. Main Section Area */}
      <div style={{ padding: '0 24px 24px 24px' }}>
        
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', marginTop: '24px' }}>
            {/* LEFT PROFILE CARD */}
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                <img 
                  src={activeProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                  alt="Profile Avatar"
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eee' }}
                />
                <h4 style={{ margin: '10px 0 2px 0', fontSize: '18px', fontWeight: '800' }}>{activeProfile.name}</h4>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>{pmsIdFallback}</span>
                <button 
                  onClick={() => setActiveTab('settings')}
                  style={{ marginTop: '12px', background: '#fafafa', border: '1px solid #ddd', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}
                >
                  Edit Profile details
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontWeight: 600 }}>Hourly Price:</span>
                  <span style={{ fontWeight: 800, color: '#c7100d' }}>₹{startingPriceFallback}/hr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontWeight: 600 }}>Experience:</span>
                  <span style={{ fontWeight: 700 }}>{experienceFallback} Years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontWeight: 600 }}>Rating:</span>
                  <span style={{ fontWeight: 700, color: '#ffb81c' }}>★ {activeProfile.rating || "4.9/5"}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontWeight: 600 }}>Reviews:</span>
                  <span style={{ fontWeight: 700 }}>{reviewsFallback} client reviews</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontWeight: 600 }}>Location:</span>
                  <span style={{ fontWeight: 700 }}>{areaFallback}, {cityFallback}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontWeight: 600 }}>Travel Outside:</span>
                  <span style={{ fontWeight: 700 }}>{travelOutsideFallback}</span>
                </div>
              </div>

              {/* Verification & Certificate */}
              <div style={{ marginTop: '8px', padding: '12px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '12.5px', color: isVerified ? '#27ae60' : '#e67e22' }}>
                  <Shield size={14} />
                  <span>{isVerified ? "Verified Partner" : "Unverified Profile"}</span>
                </div>
                {isVerified && (
                  <button 
                    onClick={() => { triggerToast("✓ Certificate PDF downloaded!"); }}
                    style={{ background: 'none', border: 'none', color: '#c7100d', padding: 0, textDecoration: 'underline', fontSize: '11px', cursor: 'pointer', marginTop: '6px', display: 'block', fontWeight: 700 }}
                  >
                    Download Certificate
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* About description & highlights */}
              <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 800, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>About Studio</h3>
                <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', margin: '0 0 16px 0' }}>{activeProfile.bio || 'No bio description set yet. Click Edit Profile settings to set up a professional description.'}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#888' }}>Highlights</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {highlightsFallback.map((hl, idx) => (
                        <span key={idx} style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>{hl}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#888' }}>Categories</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {categoriesFallback.map((cat, idx) => (
                        <span key={idx} style={{ background: 'rgba(199, 16, 13, 0.1)', border: '1px solid rgba(199, 16, 13, 0.2)', color: '#c7100d', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>{cat}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 800, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Connected Social channels</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[
                    { label: "Google My Business", connected: !!activeProfile.gmbUrl, url: activeProfile.gmbUrl },
                    { label: "Instagram Link", connected: !!activeProfile.instaUrl, url: activeProfile.instaUrl },
                    { label: "Facebook Page", connected: !!activeProfile.fbUrl, url: activeProfile.fbUrl },
                    { label: "Website URL", connected: !!activeProfile.webUrl, url: activeProfile.webUrl }
                  ].map((soc, idx) => (
                    <div key={idx} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '6px' }}>{soc.label}</div>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '10px', 
                        fontWeight: 700,
                        background: soc.connected ? '#e8f5e9' : '#f5f5f5',
                        color: soc.connected ? '#27ae60' : '#888'
                      }}>
                        {soc.connected ? "Connected" : "Not Linked"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Inquiries */}
              <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 800, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Client Inquiries Requests</h3>
                <div className="table-container-no-pad" style={{ marginTop: '12px' }}>
                  {inquiries.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>No client inquiries received yet.</div>
                  ) : (
                    <table className="console-data-table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Phone Number</th>
                          <th>Event Date</th>
                          <th>Category</th>
                          <th>Inquiry Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.map(inq => (
                          <tr key={inq.id}>
                            <td className="bold">{inq.clientName}</td>
                            <td>{inq.phone}</td>
                            <td>{inq.date}</td>
                            <td className="bold" style={{ color: '#c7100d' }}>{inq.category}</td>
                            <td style={{ fontSize: '12.5px', color: '#555' }}>{inq.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Client Gig Reservations Directory</h3>
            </div>
            <div className="console-section-body table-container-no-pad">
              {photographerBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
                  No gig reservations logged.
                </div>
              ) : (
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Booking Package</th>
                      <th>Client Name</th>
                      <th>Reserved Date</th>
                      <th>Slot Time</th>
                      <th>Net Value</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {photographerBookings.map(b => (
                      <tr key={b.id}>
                        <td className="bold" style={{ color: '#c7100d' }}>{b.title}</td>
                        <td>{b.clientName || 'Client Profile'}</td>
                        <td>{b.date}</td>
                        <td>{b.time}</td>
                        <td className="bold">{typeof b.price === 'number' ? `₹${b.price.toLocaleString('en-IN')}` : b.price}</td>
                        <td>
                          <span className={`status-badge-chip ${b.status}`}>{b.status}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {b.status === 'pending' && (
                            <div style={{ display: 'inline-flex', gap: '8px', margin: '0 auto' }}>
                              <button 
                                className="console-action-btn claim-btn"
                                onClick={() => { updateBookingStatus(b.id, 'approved'); triggerToast("✓ Booking Approved!"); }}
                                style={{ padding: '6px 10px' }}
                              >
                                Approve
                              </button>
                              <button 
                                className="console-action-btn delete-btn"
                                onClick={() => { updateBookingStatus(b.id, 'cancelled'); triggerToast("✓ Booking Declined!"); }}
                                style={{ padding: '6px 10px' }}
                              >
                                Decline
                              </button>
                            </div>
                          )}
                          {b.status !== 'pending' && (
                            <span className="muted-italic" style={{ fontSize: '12px' }}>Finalized</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {activeTab === 'catalog' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">My Catalog Items Directory</h3>
            </div>
            <div className="console-section-body table-container-no-pad">
              {photographerOwnedListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
                  No active catalog listings found. Add listings via the primary header button!
                </div>
              ) : (
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Catalog Listing</th>
                      <th>Category Type</th>
                      <th>Base Pricing</th>
                      <th>Location Context</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {photographerOwnedListings.map(lst => (
                      <tr key={lst.id}>
                        <td className="bold" style={{ color: '#c7100d' }}>{lst.title}</td>
                        <td style={{ fontWeight: '600' }}>{lst.type}</td>
                        <td>₹{lst.price} / {lst.priceUnit || 'hr'}</td>
                        <td>{lst.location}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            className={`console-action-btn ${lst.active ? 'claim-btn' : 'delete-btn'}`}
                            onClick={() => { toggleListingActive(lst.id, lst.categoryKey); triggerToast("Listing visibility toggled!"); }}
                            style={{ padding: '6px 14px', display: 'inline-flex', margin: '0 auto' }}
                          >
                            {lst.active ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {activeTab === 'portfolio' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header flex-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="section-title-text">My Creative Gallery Portfolio</h3>
              <button className="console-action-btn claim-btn" onClick={() => setShowPortfolioModal(true)} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={14} /> Add image via URL
              </button>
            </div>
            <div className="console-section-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Presets and Upload tools */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* Drag / Drop mock container */}
                <div style={{ border: '2px dashed #ccc', borderRadius: '12px', padding: '24px', textAlign: 'center', background: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => {
                  triggerToast("✓ Mock file dialog opened! Drag and drop or browse files.");
                }}>
                  <Upload size={32} style={{ color: '#888', marginBottom: '8px' }} />
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#333' }}>Drag & Drop Showcase Photos</div>
                  <span style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Supports PNG, JPG (under 2MB limit)</span>
                </div>

                {/* Preset shortcuts */}
                <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '12px', padding: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13.5px', fontWeight: 800 }}>Quick Test Presets</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      "Wedding Showcase",
                      "Pre-Wedding Magic",
                      "Candid Romance",
                      "Maternity Elegance",
                      "Baby Laugh",
                      "Commercial Shoot"
                    ].map(preset => (
                      <button 
                        key={preset}
                        onClick={() => loadPresetGallery(preset)}
                        style={{
                          background: '#fff',
                          border: '1px solid #ddd',
                          padding: '8px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#c7100d'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#ddd'}
                      >
                        ⚡ {preset}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Portfolio visual grid */}
              <div>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 800 }}>Active Portfolio Showcase ({portfolioItems.length} photos)</h4>
                {portfolioItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', background: '#fafafa', borderRadius: '12px', color: '#666', fontStyle: 'italic', border: '1px solid #eee' }}>
                    No photos in your portfolio gallery. Use presets or click Add to publish photos.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {portfolioItems.map(pf => (
                      <div key={pf.id} className="portfolio-grid-card" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee', height: '150px' }}>
                        <img 
                          src={pf.image} 
                          alt={pf.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ 
                          position: 'absolute', 
                          inset: 0, 
                          background: 'rgba(0,0,0,0.4)', 
                          opacity: 0, 
                          transition: 'opacity 0.2s', 
                          display: 'flex', 
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: '12px',
                          color: 'white'
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                        onMouseOut={e => e.currentTarget.style.opacity = 0}
                        >
                          <span style={{ fontSize: '11px', fontWeight: 700, background: '#c7100d', padding: '2px 6px', borderRadius: '8px', width: 'fit-content' }}>{pf.category}</span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>{pf.title}</span>
                            <button 
                              onClick={() => {
                                // Delete portfolio item helper
                                triggerToast("✓ Photo deleted from portfolio");
                              }}
                              style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: 0 }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {activeTab === 'packages' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Configure Pricing Catalog Packages</h3>
            </div>
            <div className="console-section-body">
              <form onSubmit={handlePackagesUpdate}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                  
                  {/* Essential */}
                  <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', background: '#fff' }}>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: '#333', marginBottom: '14px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>Essential Package</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#666' }}>Package Price (₹)</label>
                        <input type="number" value={essentialPrice} onChange={e => setEssentialPrice(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#666' }}>Hours Coverage</label>
                        <input type="number" value={essentialHours} onChange={e => setEssentialHours(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#666' }}>Photographers Count</label>
                        <input type="number" value={essentialPhotographers} onChange={e => setEssentialPhotographers(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                    </div>
                  </div>

                  {/* Premium */}
                  <div style={{ border: '2px solid #c7100d', borderRadius: '12px', padding: '20px', background: '#fff', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '-11px', right: '12px', background: '#c7100d', color: '#fff', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '10px' }}>Popular Choice</span>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: '#c7100d', marginBottom: '14px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>Premium Package</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#666' }}>Package Price (₹)</label>
                        <input type="number" value={premiumPrice} onChange={e => setPremiumPrice(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#666' }}>Hours Coverage</label>
                        <input type="number" value={premiumHours} onChange={e => setPremiumHours(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#666' }}>Photographers Count</label>
                        <input type="number" value={premiumPhotographers} onChange={e => setPremiumPhotographers(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                    </div>
                  </div>

                  {/* Luxury */}
                  <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', background: '#fff' }}>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: '#333', marginBottom: '14px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>Luxury Package</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#666' }}>Package Price (₹)</label>
                        <input type="number" value={luxuryPrice} onChange={e => setLuxuryPrice(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#666' }}>Hours Coverage</label>
                        <input type="number" value={luxuryHours} onChange={e => setLuxuryHours(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#666' }}>Photographers Count</label>
                        <input type="number" value={luxuryPhotographers} onChange={e => setLuxuryPhotographers(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                    </div>
                  </div>

                </div>

                <button type="submit" className="console-action-btn claim-btn" style={{ padding: '12px 24px', fontWeight: 700 }}>
                  Save Pricing Packages
                </button>
              </form>
            </div>
          </section>
        )}

        {activeTab === 'calendar' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Manage Availability Schedule Calendar</h3>
            </div>
            <div className="console-section-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#666' }}>
                Click on any date slot below to toggle your availability state. 
                Slots marked in <strong>red (Booked)</strong> will be disabled for client bookings, while <strong>white (Open)</strong> slots represent available workdays.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginTop: '12px' }}>
                {getNext30Days().map(dt => {
                  const isBlocked = blockedDates.includes(dt.dateString);
                  return (
                    <div 
                      key={dt.dateString}
                      onClick={() => toggleDateBlocked(dt.dateString)}
                      style={{
                        border: isBlocked ? '2px solid #ff4d4d' : '2px solid #27ae60',
                        borderRadius: '10px',
                        padding: '14px 10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: isBlocked ? 'rgba(255, 77, 77, 0.15)' : '#fff',
                        transition: 'all 0.2s',
                        userSelect: 'none'
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>{dt.dayName}</div>
                      <div style={{ fontSize: '18px', fontWeight: 850, margin: '4px 0', color: isBlocked ? '#ff4d4d' : '#27ae60' }}>{dt.formatted}</div>
                      <span style={{ 
                        fontSize: '9.5px', 
                        fontWeight: 900, 
                        textTransform: 'uppercase',
                        color: isBlocked ? '#ff4d4d' : '#27ae60'
                      }}>
                        {isBlocked ? "● Booked" : "✓ Open"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'invoices' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Billing Invoice Generator</h3>
            </div>
            <div className="console-section-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              {/* Invoice Form */}
              <div className="settings-form" style={{ gap: '16px' }}>
                <h4 style={{ margin: 0, fontWeight: '700' }}>Create Reservation Invoice</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Select active gig booking</label>
                  <select 
                    value={selectedInvoiceBookingId}
                    onChange={e => setSelectedInvoiceBookingId(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  >
                    <option value="">-- Choose gig booking --</option>
                    {photographerBookings.map(b => (
                      <option key={b.id} value={b.id}>{b.title} ({b.clientName || 'Client'})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Apply Discount Percentage (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={invoiceDiscount}
                    onChange={e => setInvoiceDiscount(parseInt(e.target.value) || 0)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Invoice Footer Remarks</label>
                  <textarea 
                    value={invoiceNotes}
                    onChange={e => setInvoiceNotes(e.target.value)}
                    rows="3"
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                  />
                </div>

                <button 
                  className="console-action-btn mail-btn" 
                  onClick={() => {
                    if (!selectedInvoiceBookingId) { triggerToast("Please select a booking first!"); return; }
                    setShowInvoicePreview(true);
                  }} 
                  style={{ padding: '12px' }}
                >
                  Generate invoice preview
                </button>
              </div>

              {/* Invoice Preview */}
              {showInvoicePreview && invoiceSelectedBooking && (
                <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', background: '#fafafa', position: 'relative' }}>
                  <div style={{ borderBottom: '2px solid #c7100d', paddingBottom: '10px', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, color: '#c7100d', fontWeight: '800' }}>Invoice: INV-{invoiceSelectedBooking.id}</h4>
                    <span style={{ fontSize: '12px', color: '#666' }}>Generated by {activeProfile.name}</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: '#333' }}>
                    <p><strong>Billing to Client:</strong> {invoiceSelectedBooking.clientName || 'Client Name'}</p>
                    <p><strong>Contact Email:</strong> {invoiceSelectedBooking.clientEmail || 'Client Email'}</p>
                    <p><strong>Gig package details:</strong> {invoiceSelectedBooking.title}</p>
                    <p><strong>Event Schedule:</strong> {invoiceSelectedBooking.date} • {invoiceSelectedBooking.time}</p>
                    <p><strong>Base pricing amount:</strong> ₹{baseInvoiceAmt.toLocaleString('en-IN')}</p>
                    {invoiceDiscount > 0 && (
                      <p style={{ color: '#00b464' }}><strong>Discount Applied ({invoiceDiscount}%):</strong> -₹{discountAmt.toLocaleString('en-IN')}</p>
                    )}
                    
                    <div style={{ borderTop: '1.5px dashed #ccc', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px' }}>
                      <span>Final Amount Due</span>
                      <span style={{ color: '#c7100d' }}>₹{finalInvoiceAmt.toLocaleString('en-IN')}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>Notes: {invoiceNotes}</p>
                  </div>

                  <button 
                    className="console-action-btn claim-btn" 
                    onClick={() => { triggerToast("✓ Invoice dispatched to client email!"); setShowInvoicePreview(false); }}
                    style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '10px' }}
                  >
                    Mail Invoice to Client
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'messages' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Client Messaging Channels</h3>
            </div>
            <div className="console-section-body" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', minHeight: '400px' }}>
              {/* Channels Sidebar */}
              <div style={{ borderRight: '1px solid #ddd', paddingRight: '15px' }}>
                {chatSessions.map(sess => (
                  <div 
                    key={sess.id} 
                    onClick={() => setSelectedSessionId(sess.id)}
                    style={{ 
                      padding: '12px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      background: selectedSessionId === sess.id ? '#c7100d' : '#f9f9f9',
                      color: selectedSessionId === sess.id ? 'white' : '#333',
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}
                  >
                    {sess.recipientName}
                  </div>
                ))}
              </div>

              {/* Chat window */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '15px', background: '#fcfcfc', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {chatMessages.filter(m => m.sessionId === selectedSessionId).map(msg => {
                    const isMe = msg.senderId === activeProfileId;
                    return (
                      <div 
                        key={msg.id} 
                        style={{ 
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          background: isMe ? '#c7100d' : '#e0e0e0',
                          color: isMe ? 'white' : '#333',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          maxWidth: '70%',
                          fontSize: '13.5px'
                        }}
                      >
                        {msg.text}
                      </div>
                    );
                  })}
                </div>
                
                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={chatInputText}
                    onChange={e => setChatInputText(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                  />
                  <button type="submit" className="console-action-btn mail-btn" style={{ padding: '10px 16px' }}>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Workspace Settings</h3>
            </div>
            <div className="console-section-body">
              <form onSubmit={handleProfileUpdate} className="settings-form" style={{ maxWidth: '750px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Creator Profile Name</label>
                  <input 
                    type="text" 
                    value={profileName} 
                    onChange={e => setProfileName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Registered Email</label>
                  <input 
                    type="email" 
                    value={profileEmail} 
                    onChange={e => setProfileEmail(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Starting Hourly Price (₹)</label>
                  <input 
                    type="number" 
                    value={profileStartingPrice} 
                    onChange={e => setProfileStartingPrice(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Experience (Years)</label>
                  <input 
                    type="number" 
                    value={profileExperience} 
                    onChange={e => setProfileExperience(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Area / Location</label>
                  <input 
                    type="text" 
                    value={profileLocation} 
                    onChange={e => setProfileLocation(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>City</label>
                  <input 
                    type="text" 
                    value={profileCity} 
                    onChange={e => setProfileCity(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Service Categories</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', background: '#fafafa', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                    {[
                      "Wedding Photography",
                      "Pre Wedding Shoot",
                      "Maternity Shoot",
                      "Baby Shoot",
                      "Candid Photography",
                      "Product Photography"
                    ].map(cat => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(cat)} 
                          onChange={() => handleToggleCategory(cat)}
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>About Studio Description</label>
                  <textarea 
                    value={profileBio} 
                    onChange={e => setProfileBio(e.target.value)}
                    rows="3"
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Highlights (comma separated)</label>
                  <input 
                    type="text" 
                    value={profileHighlights} 
                    onChange={e => setProfileHighlights(e.target.value)}
                    placeholder="e.g. 1+ Year Experience, Creative Angles, High-End Gear"
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Languages (comma separated)</label>
                  <input 
                    type="text" 
                    value={profileLanguages} 
                    onChange={e => setProfileLanguages(e.target.value)}
                    placeholder="e.g. English, Hindi, Telugu"
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Travel Outside City</label>
                  <select 
                    value={profileTravelOutside} 
                    onChange={e => setProfileTravelOutside(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Google My Business URL</label>
                  <input 
                    type="text" 
                    value={profileGmbUrl} 
                    onChange={e => setProfileGmbUrl(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Instagram URL</label>
                  <input 
                    type="text" 
                    value={profileInstaUrl} 
                    onChange={e => setProfileInstaUrl(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Facebook URL</label>
                  <input 
                    type="text" 
                    value={profileFbUrl} 
                    onChange={e => setProfileFbUrl(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Website URL</label>
                  <input 
                    type="text" 
                    value={profileWebUrl} 
                    onChange={e => setProfileWebUrl(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="submit" className="console-action-btn mail-btn" style={{ padding: '12px 24px', fontWeight: 700 }}>
                    Save details
                  </button>
                  <button type="button" onClick={() => setActiveTab('overview')} className="console-action-btn delete-btn" style={{ padding: '12px 24px', background: '#fafafa', border: '1px solid #ddd', color: '#666', fontWeight: 700 }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

      </div>

      {/* Upload Image Modal */}
      {showPortfolioModal && (
        <div className="detail-modal-overlay" style={{ zIndex: 1000 }} onClick={() => setShowPortfolioModal(false)}>
          <div className="detail-modal-body" style={{ maxWidth: '500px', minHeight: 'auto', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#c7100d', fontWeight: '800' }}>Upload New Portfolio Item</h3>
              <button onClick={() => setShowPortfolioModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleAddPortfolioSubmit} className="settings-form" style={{ gap: '16px', marginTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700' }}>Portfolio Title</label>
                <input 
                  type="text" 
                  value={pfTitle} 
                  onChange={e => setPfTitle(e.target.value)}
                  placeholder="e.g. Wedding Editorial"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700' }}>Category</label>
                <select 
                  value={pfCategory} 
                  onChange={e => setPfCategory(e.target.value)}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="Western / Editorial">Western / Editorial</option>
                  <option value="Traditional Wedding">Traditional Wedding</option>
                  <option value="Candid Portrait">Candid Portrait</option>
                  <option value="Product Showcase">Product Showcase</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700' }}>Portfolio Image URL</label>
                <input 
                  type="text" 
                  value={pfImage} 
                  onChange={e => setPfImage(e.target.value)}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              <button type="submit" className="console-action-btn claim-btn" style={{ padding: '12px', justifyContent: 'center' }}>
                Save Portfolio Item
              </button>
            </form>
          </div>
        </div>
      )}

        {/* Verification Tab */}
        {activeTab === 'verification' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">
                <Shield size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Partner Profile Verification
              </h3>
            </div>
            <div className="console-section-body" style={{ padding: '32px', maxWidth: 520 }}>

              {/* Current status banner */}
              {isVerified ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px 24px', borderRadius: '12px', background: '#e8f5e9', border: '1.5px solid #a5d6a7', marginBottom: '28px' }}>
                  <CheckCircle size={28} color="#27ae60" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#1b5e20' }}>✓ Verified Partner Profile</div>
                    <div style={{ fontSize: '13px', color: '#388e3c', marginTop: '3px' }}>Your PickMyShoot partner status is active and verified.</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px 24px', borderRadius: '12px', background: '#fff3e0', border: '1.5px solid #ffcc80', marginBottom: '28px' }}>
                  <Shield size={28} color="#e67e22" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#e65100' }}>⚠ Unverified Profile</div>
                    <div style={{ fontSize: '13px', color: '#bf360c', marginTop: '3px' }}>Your profile is not yet verified. Enter the code you received by email from the admin below.</div>
                  </div>
                </div>
              )}

              {/* Steps */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>How verification works</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { step: '1', text: 'Admin reviews your profile and clicks "Generate & Mail Code" in the Partner Directory' },
                    { step: '2', text: 'You receive an email with a unique code (e.g. PMS-6789)' },
                    { step: '3', text: 'Enter the code below to activate your verified partner status' },
                    { step: '4', text: 'Verified badge appears on your profile and in the admin directory' },
                  ].map(s => (
                    <div key={s.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ minWidth: 26, height: 26, borderRadius: '50%', background: '#c7100d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px', flexShrink: 0 }}>{s.step}</span>
                      <span style={{ fontSize: '13.5px', color: '#444', lineHeight: 1.5, paddingTop: '3px' }}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Entry Form */}
              {!isVerified && (
                <form onSubmit={handleVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: '#333' }}>Enter Your Verification Code</label>
                    <input
                      type="text"
                      value={verifyCode}
                      onChange={e => setVerifyCode(e.target.value.toUpperCase())}
                      placeholder="e.g. PMS-6789"
                      maxLength={10}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: '10px',
                        border: '2px solid #e0e0e0', fontSize: '22px', fontWeight: 800,
                        letterSpacing: '4px', textAlign: 'center', boxSizing: 'border-box',
                        fontFamily: 'monospace', textTransform: 'uppercase',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {verifyMessage && (
                    <div style={{
                      padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                      background: verifyMessage.type === 'success' ? '#e8f5e9' : '#fdecea',
                      color: verifyMessage.type === 'success' ? '#1b5e20' : '#c0392b',
                      border: `1px solid ${verifyMessage.type === 'success' ? '#a5d6a7' : '#f5c6cb'}`
                    }}>
                      {verifyMessage.type === 'success' ? '✓ ' : '✗ '}{verifyMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={verifyLoading || !verifyCode.trim()}
                    className="console-action-btn claim-btn"
                    style={{ padding: '13px 24px', fontSize: '14px', fontWeight: 700, justifyContent: 'center', opacity: verifyLoading ? 0.7 : 1 }}
                  >
                    <Shield size={15} style={{ marginRight: '8px' }} />
                    {verifyLoading ? 'Verifying…' : 'Verify My Profile'}
                  </button>
                </form>
              )}

            </div>
      {/* Add Profile Modal */}
      {showAddProfileModal && (
        <div className="detail-modal-overlay" style={{ zIndex: 1000 }} onClick={() => setShowAddProfileModal(false)}>
          <div className="detail-modal-body" style={{ maxWidth: '420px', minHeight: 'auto', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#c7100d', fontWeight: '800' }}>Create Professional Profile</h3>
              <button onClick={() => setShowAddProfileModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleCreateProfile} className="settings-form" style={{ gap: '16px', marginTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700' }}>Profile Type</label>
                <select 
                  value={newProfileType} 
                  onChange={e => setNewProfileType(e.target.value)}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="Photographer">Photographer</option>
                  <option value="Studio Profile">Studio Profile</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700' }}>
                  {newProfileType === 'Studio Profile' ? 'Studio Name' : 'Photographer Name'}
                </label>
                <input 
                  type="text" 
                  value={newProfileName} 
                  onChange={e => setNewProfileName(e.target.value)}
                  placeholder={newProfileType === 'Studio Profile' ? 'e.g. Om Sai Digital Photo Studio' : 'e.g. Harish Kumar'}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700' }}>Starting Price (₹)</label>
                <input 
                  type="number" 
                  value={newProfilePrice} 
                  onChange={e => setNewProfilePrice(e.target.value)}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              <button type="submit" className="console-action-btn claim-btn" style={{ padding: '12px', justifyContent: 'center', fontWeight: 700 }}>
                Create Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Public Profile View Modal */}
      {showPublicProfileModal && (
        <div className="detail-modal-overlay" style={{ zIndex: 1000 }} onClick={() => setShowPublicProfileModal(false)}>
          <div className="detail-modal-body" style={{ maxWidth: '800px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '0', borderRadius: '16px' }} onClick={e => e.stopPropagation()}>
            
            {/* Header banner */}
            <div style={{ background: 'linear-gradient(135deg, #c7100d 0%, #a30d0b 100%)', color: 'white', padding: '30px 24px', position: 'relative' }}>
              <button 
                onClick={() => setShowPublicProfileModal(false)} 
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                <X size={18} />
              </button>
              
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img 
                  src={activeProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                  alt="Avatar"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid white', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>{activeProfile.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
                    <MapPin size={12} />
                    <span>{areaFallback}, {cityFallback}</span>
                    <span>•</span>
                    <span>{pmsIdFallback}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
              
              <div>
                {/* Tabs inside Public View */}
                <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 800, fontSize: '15px', color: '#c7100d', borderBottom: '2.5px solid #c7100d', paddingBottom: '8px' }}>About Creator</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', margin: 0 }}>{activeProfile.bio}</p>
                  
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#888' }}>Studio Highlights</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {highlightsFallback.map((hl, idx) => (
                        <span key={idx} style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>{hl}</span>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Gallery Showcase */}
                  <div>
                    <h4 style={{ margin: '16px 0 8px 0', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#888' }}>Portfolio Gallery</h4>
                    {portfolioItems.length === 0 ? (
                      <div style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>No portfolio photos uploaded yet.</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {portfolioItems.map(pf => (
                          <img 
                            key={pf.id} 
                            src={pf.image} 
                            alt={pf.title} 
                            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Actions */}
              <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Starting Price</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#c7100d', margin: '4px 0' }}>₹{startingPriceFallback} <span style={{ fontSize: '12px', color: '#666' }}>/ hr</span></div>
                  <div style={{ fontSize: '12px', color: '#ffb81c', fontWeight: 700 }}>★ {activeProfile.rating || "4.9"} ({reviewsFallback} reviews)</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button 
                    onClick={() => setShowInquiryModal(true)}
                    style={{ width: '100%', background: '#c7100d', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Mail size={14} /> Send Inquiry
                  </button>
                  <a 
                    href={`https://wa.me/919999900000?text=Hi%20${activeProfile.name},%20I'm%20interested%20in%20booking%20a%20photoshoot%20with%20you!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none', boxSizing: 'border-box' }}
                  >
                    Chat on WhatsApp
                  </a>
                </div>

                <div style={{ fontSize: '11px', color: '#888', lineHeight: '1.4' }}>
                  Member since {activeProfile.memberSince || 'June 2026'}. Average response time: <strong>under 1 hour</strong>.
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Send Inquiry Modal */}
      {showInquiryModal && (
        <div className="detail-modal-overlay" style={{ zIndex: 1100 }} onClick={() => setShowInquiryModal(false)}>
          <div className="detail-modal-body" style={{ maxWidth: '450px', minHeight: 'auto', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#c7100d', fontWeight: '800' }}>Send Event Inquiry</h3>
              <button onClick={() => setShowInquiryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSendInquirySubmit} className="settings-form" style={{ gap: '14px', marginTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Your Full Name</label>
                <input 
                  type="text" 
                  value={inquiryName} 
                  onChange={e => setInquiryName(e.target.value)}
                  placeholder="e.g. Harish Kumar"
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Phone Number</label>
                <input 
                  type="text" 
                  value={inquiryPhone} 
                  onChange={e => setInquiryPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Event Date</label>
                <input 
                  type="date" 
                  value={inquiryDate} 
                  onChange={e => setInquiryDate(e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Event Category</label>
                <select 
                  value={inquiryCategory} 
                  onChange={e => setInquiryCategory(e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  <option value="Wedding Photography">Wedding Photography</option>
                  <option value="Pre Wedding Shoot">Pre Wedding Shoot</option>
                  <option value="Maternity Shoot">Maternity Shoot</option>
                  <option value="Baby Shoot">Baby Shoot</option>
                  <option value="Candid Photography">Candid Photography</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Details / Message</label>
                <textarea 
                  value={inquiryMessage} 
                  onChange={e => setInquiryMessage(e.target.value)}
                  placeholder="Describe your shoot requirements..."
                  rows="3"
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                />
              </div>

              <button type="submit" className="console-action-btn claim-btn" style={{ padding: '12px', justifyContent: 'center', fontWeight: 700 }}>
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

          </section>
        )}

    </div>

  );
};

export default PhotographerDashboard;
