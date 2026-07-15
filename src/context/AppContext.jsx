import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  popularServices as initialServices, 
  studios as initialStudios, 
  models as initialModels, 
  gearRentals as initialGear, 
  workshops as initialWorkshops, 
  jobs as initialJobs 
} from '../data/mockData';

const defaultMockProfiles = [
  {
    id: "demo-admin",
    name: "Anusha (Admin)",
    role: "admin",
    email: "anusripvc202@gmail.com",
    phone: "+91 99999 88888",
    bio: "Platform Security Control Center Administrator.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=180&q=80",
    shoots: "0",
    rating: "5.0 ★",
    followers: "0",
    revenue: "₹0",
    success: "100%",
    views: "1",
    studioName: "PickMyShoot HQ"
  },
  {
    id: "demo-photographer",
    name: "Rahul Verma (Photographer)",
    role: "photographer",
    email: "photographer@pickmyshoot.com",
    phone: "+91 98765 43210",
    bio: "Professional photographer with 8+ years experience in weddings, portraits, and fashion.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80",
    shoots: "150+",
    rating: "4.9 ★",
    followers: "24K",
    revenue: "₹2.4L",
    success: "98%",
    views: "1200"
  },
  {
    id: "demo-client",
    name: "Priya Sharma (Client)",
    role: "client",
    email: "client@pickmyshoot.com",
    phone: "+91 87654 32109",
    bio: "Content creator and brand photographer from Mumbai.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80",
    shoots: "5",
    rating: "5.0 ★",
    followers: "240",
    revenue: "₹0",
    success: "100%",
    views: "20"
  }
];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  // 1. Multi-Profile Global States
  const [profiles, setProfiles] = useState(defaultMockProfiles || []);

  const [activeProfileId, setActiveProfileId] = useState(() => {
    return localStorage.getItem('pickmyshoot_active_profile_id') || "";
  });
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('pickmyshoot_current_role') || 'client';
  });

  // 1.5 Authentication Global States
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('pickmyshoot_is_authenticated') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pickmyshoot_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Lists
  const [services, setServices] = useState(initialServices || []);
  const [studios, setStudios] = useState(initialStudios || []);
  const [models, setModels] = useState(initialModels || []);
  const [gear, setGear] = useState(initialGear || []);
  const [workshops, setWorkshops] = useState(initialWorkshops || []);
  const [jobs, setJobs] = useState(initialJobs || []);


  // Initial Mock Portfolio Items state
  const [portfolioItems, setPortfolioItems] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreTab, setExploreTab] = useState('services');

  // Bookings list state - initialized to empty array (clean dashboard)
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('upcoming');

  // Liked items state (ID -> boolean map)
  const [likedItems, setLikedItems] = useState({});

  // Support Tickets State - initialized to empty array (clean dashboard)
  const [tickets, setTickets] = useState([]);

  // Chats / Messaging State - initialized to empty array (clean dashboard)
  const [chatSessions, setChatSessions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // Load real chat messages from database
  useEffect(() => {
    if (!activeProfileId || profiles.length === 0) {
      setChatSessions([]);
      setChatMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const res = await fetch(`/api/messages?userId=${activeProfileId}`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to load messages");
        const msgs = await res.json();
        
        // Group by sessionId to build sessions list dynamically
        const sessionsMap = {};
        msgs.forEach(m => {
          const partnerId = m.senderId === activeProfileId ? m.recipientId : m.senderId;
          const partnerProfile = profiles.find(p => p.id === partnerId || p._id === partnerId);
          const partnerName = partnerProfile ? partnerProfile.name : "Partner User";
          
          if (!sessionsMap[m.sessionId]) {
            sessionsMap[m.sessionId] = {
              id: m.sessionId,
              recipientId: partnerId,
              recipientName: partnerName,
              lastMessage: m.text,
              lastUpdated: m.time || "Just now"
            };
          } else {
            sessionsMap[m.sessionId].lastMessage = m.text;
            if (m.time) {
              sessionsMap[m.sessionId].lastUpdated = m.time;
            }
          }
        });

        setChatMessages(msgs);
        setChatSessions(Object.values(sessionsMap));
      } catch (err) {
        console.warn("Failed to load chat messages:", err);
      }
    };

    loadMessages();
    // Poll every 3 seconds to get new incoming messages instantly!
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [activeProfileId, profiles]);

  // Coupons State
  const [coupons, setCoupons] = useState([]);

  // Selected item for details modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(''); // 'service' | 'studio' | 'model' | 'gear' | 'workshop' | 'job'
  
  // Booking date & time scheduler inside details view
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${tomorrow.getDate()} ${monthNamesShort[tomorrow.getMonth()]} ${tomorrow.getFullYear()}`;
  });
  const [selectedTime, setSelectedTime] = useState('10:00 AM');

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '' });

  // Show Toast helper function
  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2800);
  };

  // Sync auth states to localStorage
  useEffect(() => {
    localStorage.setItem('pickmyshoot_is_authenticated', isAuthenticated);
    if (currentUser) {
      localStorage.setItem('pickmyshoot_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pickmyshoot_current_user');
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    localStorage.setItem('pickmyshoot_active_profile_id', activeProfileId);
  }, [activeProfileId]);

  useEffect(() => {
    localStorage.setItem('pickmyshoot_current_role', currentRole);
  }, [currentRole]);

  // Sync currentUser details when profiles list is edited
  useEffect(() => {
    if (currentUser) {
      const updatedUser = profiles.find(p => p.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [profiles, currentUser]);

  const getAuthHeaders = () => {
    const userId = localStorage.getItem('pickmyshoot_active_profile_id') || "";
    let authProvider = 'email';
    try {
      const storedUser = localStorage.getItem('pickmyshoot_current_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.authProvider) {
          authProvider = parsed.authProvider;
        }
      }
    } catch (e) { /* ignore */ }

    return {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      'X-Auth-Provider': authProvider
    };
  };

  // Load registered users from MongoDB on startup
  useEffect(() => {
    fetch('/api/users', {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load users");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const dbProfiles = data.map(u => {
            let bioText = u.bio || "Newly registered visual creator profile.";
            let startingPrice = u.startingPrice;
            let instaUrl = u.instaUrl;
            let categories = u.categories || (u.role === 'photographer' ? ["Wedding Photography", "Candid Photography"] : []);
            let highlights = u.highlights || (u.role === 'photographer' ? ["1+ Year Experience", "Creative Angles", "High-End Camera Equipment"] : []);
            let languages = u.languages || ["English", "Hindi", "Telugu"];
            let travelOutside = u.travelOutside || "Yes";
            let gmbUrl = u.gmbUrl || "";
            let fbUrl = u.fbUrl || "";
            let webUrl = u.webUrl || "";

            try {
              if (u.bio && u.bio.startsWith('{')) {
                const parsed = JSON.parse(u.bio);
                if (parsed && typeof parsed === 'object') {
                  bioText = parsed.text || bioText;
                  startingPrice = parsed.startingPrice || startingPrice;
                  instaUrl = parsed.instaUrl || instaUrl;
                  categories = parsed.categories || categories;
                  highlights = parsed.highlights || highlights;
                  languages = parsed.languages || languages;
                  travelOutside = parsed.travelOutside || travelOutside;
                  gmbUrl = parsed.gmbUrl || gmbUrl;
                  fbUrl = parsed.fbUrl || fbUrl;
                  webUrl = parsed.webUrl || webUrl;
                }
              }
            } catch (e) {
              // Not JSON
            }

            return {
              ...u,
              id: u.id || u._id,
              name: u.name,
              role: u.role || 'client',
              email: u.email,
              phone: u.phone || "+91 99999 88888",
              bio: bioText,
              avatar: u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80",
              shoots: u.shoots || "0",
              rating: u.rating || "5.0 ★",
              followers: u.followers || "0",
              revenue: u.revenue || "₹0",
              success: u.success || "100%",
              views: u.views || "1",
              studioName: u.studioName || u.studio_name || "",
              startingPrice: startingPrice,
              instaUrl: instaUrl,
              categories,
              highlights,
              languages,
              travelOutside,
              gmbUrl,
              fbUrl,
              webUrl
            };
          });

          setProfiles(prev => {
            // Keep existing profiles unless they match email of DB profiles
            const filteredPrev = prev.filter(p => !dbProfiles.some(dp => dp.email.toLowerCase() === p.email.toLowerCase()));
            return [...filteredPrev, ...dbProfiles];
          });
        }
      })
      .catch(err => console.warn('Failed to load users from DB:', err));
  }, [isAuthenticated, activeProfileId]);

  // Load and poll bookings from MongoDB
  useEffect(() => {
    const loadBookings = () => {
      fetch('/api/bookings', {
        headers: getAuthHeaders()
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to load bookings");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            const dbBookings = data.map(b => {
              let parsedItem = b.item;
              if (typeof b.item === 'string') {
                try {
                  parsedItem = JSON.parse(b.item);
                } catch (e) {
                  console.warn("Failed to parse booking item:", e);
                }
              }
              return {
                ...b,
                id: b.id || b._id,
                ownerId: b.ownerId || b.creatorId,
                item: parsedItem
              };
            });
            
            // Sync state and avoid unnecessary renders if the data is unchanged
            setBookings(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(dbBookings)) {
                // Check if a new booking has been added
                if (prev.length > 0 && dbBookings.length > prev.length) {
                  const newBookings = dbBookings.filter(b => !prev.some(p => p.id === b.id));
                  newBookings.forEach(nb => {
                    if (nb.status === 'pending' && (nb.ownerId === activeProfileId || nb.creatorId === activeProfileId)) {
                      triggerToast(`🔔 New booking request received: "${nb.title}"!`);
                    }
                  });
                }
                return dbBookings;
              }
              return prev;
            });
          }
        })
        .catch(err => console.warn('Failed to load bookings from DB:', err));
    };

    loadBookings();
    const interval = setInterval(loadBookings, 5000); // poll every 5s for real-time notification feel
    return () => clearInterval(interval);
  }, [activeProfileId, isAuthenticated]);

  // Reusable function: load listings from DB and merge with mock data
  const reloadListings = () => {
    fetch('/api/listings', {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load listings");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const dbServices = [];
          const dbStudios = [];
          const dbModels = [];
          const dbGear = [];
          const dbWorkshops = [];
          const dbJobs = [];

          data.forEach(item => {
            // Only include active DB listings
            if (item.active === false) return;
            const mappedItem = {
              ...item,
              id: item.id || item._id,
              ownerId: item.ownerId || (item.creatorId && typeof item.creatorId === 'object' ? item.creatorId.id || item.creatorId._id : item.creatorId)
            };
            if (item.type === 'service') dbServices.push(mappedItem);
            else if (item.type === 'studio') dbStudios.push(mappedItem);
            else if (item.type === 'model') dbModels.push(mappedItem);
            else if (item.type === 'gear') dbGear.push(mappedItem);
            else if (item.type === 'workshop') dbWorkshops.push(mappedItem);
            else if (item.type === 'job') dbJobs.push(mappedItem);
          });

          // Helper: merge DB items with prev mock data.
          const mergeItems = (dbItems, prev) => {
            const enriched = dbItems.map(dbItem => {
              const mock = prev.find(p => p.id === dbItem.id);
              if (!mock) return dbItem;
              return {
                ...dbItem,
                image:       dbItem.image       || mock.image,
                title:       dbItem.title       || mock.title,
                description: dbItem.description || mock.description,
                rating:      dbItem.rating      ?? mock.rating,
                reviews:     dbItem.reviews     ?? mock.reviews,
              };
            });
            const filteredPrev = prev.filter(p => !enriched.some(d => d.id === p.id));
            return [...enriched, ...filteredPrev];
          };

          // Always replace with full DB list (enriched) so new custom listings always show
          setServices(prev  => mergeItems(dbServices,  prev));
          setStudios(prev   => mergeItems(dbStudios,   prev));
          setModels(prev    => mergeItems(dbModels,    prev));
          setGear(prev      => mergeItems(dbGear,      prev));
          setWorkshops(prev => mergeItems(dbWorkshops, prev));
          setJobs(prev      => mergeItems(dbJobs,      prev));
        }
      })
      .catch(err => console.warn('Failed to load listings from DB — showing mock data:', err));
  };

  // Load listings from DB on app startup
  useEffect(() => {
    reloadListings();
  }, []);




  // Toggle Like state
  const toggleLike = (id, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      triggerToast("Please log in to add items to favorites.");
      navigate('/login');
      return;
    }
    setLikedItems(prev => {
      const nextState = !prev[id];
      triggerToast(nextState ? "Added to favorites!" : "Removed from favorites");
      return { ...prev, [id]: nextState };
    });
  };

  // Open detail modal
  const openDetails = (item, type) => {
    if (!isAuthenticated) {
      triggerToast("Please log in to view details and make a booking.");
      navigate('/login');
      return;
    }
    setSelectedItem(item);
    setSelectedItemType(type);
    
    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    setSelectedDate(`${tomorrow.getDate()} ${monthNamesShort[tomorrow.getMonth()]} ${tomorrow.getFullYear()}`);
    setSelectedTime('10:00 AM');
  };

  // Book Item action
  const handleBookingSubmit = (autoClose = true) => {
    if (!selectedItem) return;

    let cost = selectedItem.price || 'Free';

    const dbBooking = {
      listingId: selectedItem.id || selectedItem._id || "",
      clientId: activeProfileId || "prof-client",
      creatorId: selectedItem.ownerId || selectedItem.creatorId || (selectedItemType === "service" ? "prof-photographer" : (selectedItemType === "institute" ? "admin" : "prof-1")),
      ownerId: selectedItem.ownerId || selectedItem.creatorId || (selectedItemType === "service" ? "prof-photographer" : (selectedItemType === "institute" ? "admin" : "prof-1")),
      itemType: selectedItemType.charAt(0).toUpperCase() + selectedItemType.slice(1),
      title: selectedItem.title || "",
      date: selectedItemType === 'workshop' ? selectedItem.date : (selectedItemType === 'institute' ? 'Immediate' : selectedDate),
      time: selectedItemType === 'workshop' ? selectedItem.timing : (selectedItemType === 'institute' ? 'Admissions Open' : selectedTime),
      price: cost,
      status: "pending",
      item: selectedItem,
      // Client details for email notification
      clientName: currentUser?.name || "",
      clientEmail: currentUser?.email || "",
      clientPhone: currentUser?.phone || ""
    };

    // Sync with backend
    fetch('/api/bookings', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(dbBooking)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save booking");
        return res.json();
      })
      .then(savedBooking => {
        let parsedItem = savedBooking.item;
        if (typeof savedBooking.item === 'string') {
          try {
            parsedItem = JSON.parse(savedBooking.item);
          } catch (e) {
            console.warn("Failed to parse saved booking item:", e);
          }
        }
        const mappedBooking = { 
          ...savedBooking, 
          id: savedBooking._id,
          ownerId: savedBooking.ownerId || savedBooking.creatorId,
          item: parsedItem
        };
        setBookings(prev => [mappedBooking, ...prev]);
        triggerToast(`Booking confirmed for ${selectedItem.title}!`);
      })
      .catch(err => {
        console.warn("Failed to sync booking to DB, saving locally:", err);
        const localBooking = { 
          id: `b-${Date.now()}`, 
          ...dbBooking,
          ownerId: dbBooking.ownerId || dbBooking.creatorId
        };
        setBookings(prev => [localBooking, ...prev]);
        triggerToast(`Booking confirmed locally for ${selectedItem.title}!`);
      });

    if (autoClose) {
      setSelectedItem(null);
    }
  };

  // Toggle active visibility of listed spaces / gear rentals dynamically
  const toggleListingActive = (id, category) => {
    if (category === 'studio') {
      setStudios(prev => prev.map(item => item.id === id ? { ...item, active: item.active === false ? true : false } : item));
    } else if (category === 'gear') {
      setGear(prev => prev.map(item => item.id === id ? { ...item, active: item.active === false ? true : false } : item));
    } else if (category === 'service') {
      setServices(prev => prev.map(item => item.id === id ? { ...item, active: item.active === false ? true : false } : item));
    }
  };

  // Switch role helper
  const changeUserRole = (newRole) => {
    setCurrentRole(newRole);
    triggerToast(`Switched to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} Workspace`);
  };

  // Update booking status helper
  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    triggerToast(`Booking status marked as ${newStatus}`);

    // Sync status update with backend
    fetch('/api/bookings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: bookingId, status: newStatus })
    }).catch(err => console.warn('Failed to sync booking status update with DB:', err));
  };

  // Toggle user verification helper
  const toggleUserVerification = (profileId) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        const isVerified = p.role.startsWith("Verified");
        const newRole = isVerified ? p.role.replace("Verified ", "") : `Verified ${p.role}`;
        return { ...p, role: newRole };
      }
      return p;
    }));
    triggerToast("User verification status updated!");
  };

  // Add portfolio photo helper
  const addPortfolioItem = (item) => {
    setPortfolioItems(prev => [
      { id: `pf-${Date.now()}`, ownerId: activeProfileId, likes: 0, aspect: 'portrait', ...item },
      ...prev
    ]);
    triggerToast("New creation added to portfolio!");
  };

  // Support Ticket Actions
  const addSupportTicket = (ticket) => {
    setTickets(prev => [{ id: `t-${Date.now()}`, clientId: activeProfileId, status: 'open', date: new Date().toISOString().split('T')[0], ...ticket }, ...prev]);
    triggerToast("Support ticket submitted successfully!");
  };
  const updateTicketStatus = (ticketId, nextStatus) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: nextStatus } : t));
    triggerToast(`Support ticket status marked as ${nextStatus}`);
  };

  // Chat/Messages Actions
  const sendChatMessage = async (sessionId, text) => {
    if (!activeProfileId) return;
    
    // Find recipient ID from the session ID (formatted as sess-id1-id2)
    const ids = sessionId.replace(/^sess-/, '').split('-');
    const recipientId = ids.find(id => id !== activeProfileId);
    if (!recipientId) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const payload = {
      sessionId,
      senderId: activeProfileId,
      recipientId,
      text,
      time: timeString
    };

    try {
      // Local optimistic update for instant UI response
      const tempId = `m-temp-${Date.now()}`;
      const tempMsg = { _id: tempId, id: tempId, ...payload, createdAt: new Date().toISOString() };
      setChatMessages(prev => [...prev, tempMsg]);

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to send message to database");
      const dbMsg = await res.json();
      
      // Replace optimistic message with actual db message
      setChatMessages(prev => prev.map(m => m._id === tempId ? { ...dbMsg, id: dbMsg._id } : m));
    } catch (err) {
      console.warn("Failed to save message:", err);
    }
  };

  // Coupon Actions
  const toggleCouponStatus = (code) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
    triggerToast(`Coupon ${code} status updated!`);
  };
  const createCoupon = (newCoupon) => {
    setCoupons(prev => [...prev, { active: true, ...newCoupon }]);
    triggerToast(`Coupon ${newCoupon.code} created successfully!`);
  };

  // Record login to MongoDB via Vercel API (photographer + all roles)
  const recordLoginActivity = (profile, role) => {
    if (!profile) return;
    fetch('/api/login-activity', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        userId: profile.id || profile._id || `user-${Date.now()}`,
        name:   profile.name  || 'Unknown',
        email:  profile.email || '',
        role:   role          || profile.role || 'client',
        avatar: profile.avatar || ''
      })
    }).catch(err => console.warn('Failed to record login activity:', err));
  };

  // Authenticate user session securely against backend
  const loginUser = async (email, password, demoProfileId = null) => {
    const getMappedRole = (profile) => {
      if (!profile || !profile.role) return 'client';
      const roleLower = profile.role.toLowerCase();
      if (roleLower.includes('admin')) return 'admin';
      if (roleLower.includes('photographer')) return 'photographer';
      return 'client';
    };

    if (demoProfileId) {
      const foundProfile = profiles.find(p => p.id === demoProfileId);
      if (foundProfile) {
        const mappedRole = getMappedRole(foundProfile);
        setCurrentUser(foundProfile);
        setActiveProfileId(foundProfile.id);
        setIsAuthenticated(true);
        setCurrentRole(mappedRole);
        recordLoginActivity(foundProfile, mappedRole);
        triggerToast(`Welcome back, ${foundProfile.name}!`);
        return true;
      }
      return false;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        triggerToast(errData.error || "Invalid email or password. Please try again!");
        return false;
      }

      const data = await res.json();
      const dbUser = data.user;

      // Map DB profile fields to include defaults
      let bioText = dbUser.bio || "Newly registered visual creator profile.";
      let startingPrice = dbUser.startingPrice;
      let instaUrl = dbUser.instaUrl;
      let categories = dbUser.categories || (dbUser.role === 'photographer' ? ["Wedding Photography", "Candid Photography"] : []);
      let highlights = dbUser.highlights || (dbUser.role === 'photographer' ? ["1+ Year Experience", "Creative Angles", "High-End Camera Equipment"] : []);
      let languages = dbUser.languages || ["English", "Hindi", "Telugu"];
      let travelOutside = dbUser.travelOutside || "Yes";
      let gmbUrl = dbUser.gmbUrl || "";
      let fbUrl = dbUser.fbUrl || "";
      let webUrl = dbUser.webUrl || "";

      try {
        if (dbUser.bio && dbUser.bio.startsWith('{')) {
          const parsed = JSON.parse(dbUser.bio);
          if (parsed && typeof parsed === 'object') {
            bioText = parsed.text || bioText;
            startingPrice = parsed.startingPrice || startingPrice;
            instaUrl = parsed.instaUrl || instaUrl;
            categories = parsed.categories || categories;
            highlights = parsed.highlights || highlights;
            languages = parsed.languages || languages;
            travelOutside = parsed.travelOutside || travelOutside;
            gmbUrl = parsed.gmbUrl || gmbUrl;
            fbUrl = parsed.fbUrl || fbUrl;
            webUrl = parsed.webUrl || webUrl;
          }
        }
      } catch (e) {}

      const mappedUser = {
        ...dbUser,
        id: dbUser.id || dbUser._id,
        name: dbUser.name,
        role: dbUser.role || 'client',
        email: dbUser.email,
        phone: dbUser.phone || "+91 99999 88888",
        bio: bioText,
        avatar: dbUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80",
        shoots: dbUser.shoots || "0",
        rating: dbUser.rating || "5.0 ★",
        followers: dbUser.followers || "0",
        revenue: dbUser.revenue || "₹0",
        success: dbUser.success || "100%",
        views: dbUser.views || "1",
        studioName: dbUser.studioName || dbUser.studio_name || "",
        startingPrice: startingPrice,
        instaUrl: instaUrl,
        categories,
        highlights,
        languages,
        travelOutside,
        gmbUrl,
        fbUrl,
        webUrl,
        authProvider: dbUser.authProvider || 'email'
      };

      // Add user to local profiles list if not already there
      setProfiles(prev => {
        const filtered = prev.filter(p => p.email.toLowerCase() !== email.toLowerCase());
        return [...filtered, mappedUser];
      });

      const mappedRole = getMappedRole(mappedUser);
      setCurrentUser(mappedUser);
      setActiveProfileId(mappedUser.id);
      setIsAuthenticated(true);
      setCurrentRole(mappedRole);
      recordLoginActivity(mappedUser, mappedRole);
      triggerToast(`Welcome back, ${mappedUser.name}!`);
      return true;

    } catch (e) {
      console.warn("Secure login attempt failed:", e);
      triggerToast("Connection error. Please try again!");
      return false;
    }
  };

  // Register new profile and auto-login
  const signupUser = (name, email, password, role, avatar = null, phone = '') => {
    const newProfileId = `prof-${Date.now()}`;
    const newProfile = {
      id: newProfileId,
      name: name,
      role: role || "client",
      email: email,
      phone: phone || "+91 99999 88888",
      bio: "Newly registered visual creator profile.",
      avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80",
      shoots: "0",
      rating: "5.0 ★",
      followers: "0",
      revenue: "₹0",
      success: "100%",
      views: "1",
      authProvider: 'email'
    };

    setProfiles(prev => [...prev, newProfile]);
    setCurrentUser(newProfile);
    setActiveProfileId(newProfileId);
    setIsAuthenticated(true);

    // Set correct role
    let assignedRole = role === 'admin' ? 'admin' : role === 'photographer' ? 'photographer' : 'client';
    if (email.toLowerCase() === 'anusripvc202@gmail.com') {
      assignedRole = 'admin';
      newProfile.role = 'admin';
    }
    setCurrentRole(assignedRole);

    // Record login activity
    recordLoginActivity(newProfile, assignedRole);

    // Sync with backend
    fetch('/api/users', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...newProfile, password })
    }).catch(err => console.warn('Failed to sync new user with DB', err));

    triggerToast(`Welcome to PickMyShoot, ${name}!`);
    return true;
  };

  // Sign out and destroy session state
  const logoutUser = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentRole('client');
    triggerToast("Logged out successfully.");
  };

  // Google sign in / sign up helper
  const loginOrSignupGoogle = async (name, email, avatar = null) => {
    let role = 'client';
    if (email.toLowerCase() === 'anusripvc202@gmail.com') role = 'admin';
    else if (email.toLowerCase() === 'nikhiljai1215@gmail.com') role = 'photographer';

    const existing = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const updatedUser = { ...existing, authProvider: 'google' };
      setCurrentUser(updatedUser);
      setActiveProfileId(existing.id);
      setIsAuthenticated(true);
      
      const roleLower = existing.role.toLowerCase();
      const mappedRole = roleLower.includes('admin') ? 'admin' : roleLower.includes('photographer') ? 'photographer' : 'client';
      setCurrentRole(mappedRole);
      recordLoginActivity(updatedUser, mappedRole);

      // Sync authProvider update to DB
      fetch('/api/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedUser)
      }).catch(err => console.warn('Failed to update Google authProvider in DB', err));

      triggerToast(`Welcome back, ${existing.name}!`);
      return true;
    } else {
      const newProfileId = `prof-${Date.now()}`;
      const newProfile = {
        id: newProfileId,
        name: name,
        role: role,
        email: email,
        phone: "+91 99999 88888",
        bio: "Newly registered visual creator profile via Google.",
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        shoots: "0",
        rating: "5.0 ★",
        followers: "0",
        revenue: "₹0",
        success: "100%",
        views: "1",
        authProvider: 'google'
      };

      setProfiles(prev => [...prev, newProfile]);
      setCurrentUser(newProfile);
      setActiveProfileId(newProfileId);
      setIsAuthenticated(true);
      setCurrentRole(role);
      recordLoginActivity(newProfile, role);

      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(newProfile)
        });
      } catch (err) {
        console.warn('Failed to sync new Google user with DB', err);
      }

      triggerToast(`Successfully registered with Google, welcome ${name}!`);
      return true;
    }
  };

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      services, setServices,
      studios, setStudios,
      models, setModels,
      gear, setGear,
      workshops, setWorkshops,
      jobs, setJobs,
      searchQuery, setSearchQuery,
      exploreTab, setExploreTab,
      bookings, setBookings,
      bookingFilter, setBookingFilter,
      likedItems, setLikedItems,
      selectedItem, setSelectedItem,
      selectedItemType, setSelectedItemType,
      selectedDate, setSelectedDate,
      selectedTime, setSelectedTime,
      toast, setToast,
      triggerToast,
      toggleLike,
      openDetails,
      handleBookingSubmit,
      profiles, setProfiles,
      activeProfileId, setActiveProfileId,
      toggleListingActive,
      isAuthenticated,
      currentUser,
      loginUser,
      signupUser,
      logoutUser,
      loginOrSignupGoogle,
      portfolioItems, setPortfolioItems,
      currentRole, changeUserRole,
      updateBookingStatus,
      toggleUserVerification,
      addPortfolioItem,
      tickets, setTickets,
      chatSessions, setChatSessions,
      chatMessages, setChatMessages,
      coupons, setCoupons,
      addSupportTicket, updateTicketStatus,
      sendChatMessage,
      toggleCouponStatus, createCoupon,
      reloadListings,
      getAuthHeaders
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
