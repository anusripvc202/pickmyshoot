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

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  // 1. Multi-Profile Global States
  const [profiles, setProfiles] = useState([]);

  const [activeProfileId, setActiveProfileId] = useState("");
  const [currentRole, setCurrentRole] = useState('client');

  // 1.5 Authentication Global States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Lists
  const [services, setServices] = useState(initialServices);
  const [studios, setStudios] = useState(initialStudios);
  const [models, setModels] = useState(initialModels);
  const [gear, setGear] = useState(initialGear);
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [jobs, setJobs] = useState(initialJobs);

  // Initial Mock Portfolio Items state
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: "pf-1",
      ownerId: "prof-photographer",
      title: "Royal Bridal Lookbook",
      category: "Bridal / Ethnic Wear",
      image: "/pre_wedding_shoot_new.png",
      likes: 312,
      aspect: "portrait"
    },
    {
      id: "pf-2",
      ownerId: "prof-1",
      title: "E-Commerce Gadget Shoot",
      category: "Product / Commercial",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      likes: 198,
      aspect: "landscape"
    },
    {
      id: "pf-3",
      ownerId: "prof-photographer",
      title: "Daylight Fashion Editorial",
      category: "High-Fashion / Western",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
      likes: 425,
      aspect: "portrait"
    },
    {
      id: "pf-4",
      ownerId: "prof-photographer",
      title: "Premium SUV Advertising",
      category: "Automotive / Action",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      likes: 184,
      aspect: "landscape"
    },
    {
      id: "pf-5",
      ownerId: "prof-photographer",
      title: "Gourmet Dessert Catalog",
      category: "Food / Styling",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
      likes: 290,
      aspect: "portrait"
    },
    {
      id: "pf-6",
      ownerId: "prof-1",
      title: "Minimalist Portrait Studies",
      category: "Fine Art / Studio Studio",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      likes: 356,
      aspect: "landscape"
    },
    {
      id: "pf-7",
      ownerId: "prof-photographer",
      title: "Nature Cinematography",
      category: "Cinematography / Nature",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80",
      likes: 220,
      aspect: "landscape"
    }
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreTab, setExploreTab] = useState('services');

  // Bookings list state - initialized to empty array (clean dashboard)
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('upcoming');

  // Liked items state (ID -> boolean map)
  const [likedItems, setLikedItems] = useState({
    "st-1": true,
    "gr-1": true,
    "ps-1": false
  });

  // Support Tickets State - initialized to empty array (clean dashboard)
  const [tickets, setTickets] = useState([]);

  // Chats / Messaging State - initialized to empty array (clean dashboard)
  const [chatSessions, setChatSessions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // Coupons State
  const [coupons, setCoupons] = useState([
    { code: "SHOOT40", discount: "40%", description: "40% off on all camera gear rentals", active: true },
    { code: "CREATOR15", discount: "15%", description: "15% off on studio space bookings", active: true },
    { code: "WEDDING500", discount: "₹500 Flat", description: "Flat ₹500 discount on pre-wedding packages", active: false }
  ]);

  // Selected item for details modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(''); // 'service' | 'studio' | 'model' | 'gear' | 'workshop' | 'job'
  
  // Booking date & time scheduler inside details view
  const [selectedDate, setSelectedDate] = useState('19 SUN');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '' });

  // Show Toast helper function
  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2800);
  };

  // Sync currentUser details when profiles list is edited
  useEffect(() => {
    if (currentUser) {
      const updatedUser = profiles.find(p => p.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [profiles, currentUser]);

  // Load registered users from MongoDB on startup
  useEffect(() => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error("Failed to load users");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const dbProfiles = data.map(u => ({
            ...u,
            id: u.id || u._id,
            name: u.name,
            role: u.role || 'client',
            email: u.email,
            phone: u.phone || "+91 99999 88888",
            bio: u.bio || "Newly registered visual creator profile.",
            avatar: u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80",
            shoots: u.shoots || "0",
            rating: u.rating || "5.0 ★",
            followers: u.followers || "0",
            revenue: u.revenue || "₹0",
            success: u.success || "100%",
            views: u.views || "1"
          }));

          setProfiles(prev => {
            // Keep existing profiles unless they match email of DB profiles
            const filteredPrev = prev.filter(p => !dbProfiles.some(dp => dp.email.toLowerCase() === p.email.toLowerCase()));
            return [...filteredPrev, ...dbProfiles];
          });
        }
      })
      .catch(err => console.warn('Failed to load users from DB:', err));
  }, []);

  // Load and poll bookings from MongoDB
  useEffect(() => {
    const loadBookings = () => {
      fetch('/api/bookings')
        .then(res => {
          if (!res.ok) throw new Error("Failed to load bookings");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            const dbBookings = data.map(b => ({
              ...b,
              id: b.id || b._id,
              ownerId: b.ownerId || b.creatorId
            }));
            
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
  }, [activeProfileId]);

  // Load listings from MongoDB on startup
  useEffect(() => {
    fetch('/api/listings')
      .then(res => {
        if (!res.ok) throw new Error("Failed to load listings");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const dbServices = [];
          const dbStudios = [];
          const dbModels = [];
          const dbGear = [];
          const dbWorkshops = [];
          const dbJobs = [];

          data.forEach(item => {
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

          if (dbServices.length > 0) {
            setServices(prev => {
              const filteredPrev = prev.filter(p => !dbServices.some(d => d.id === p.id));
              return [...dbServices, ...filteredPrev];
            });
          }
          if (dbStudios.length > 0) {
            setStudios(prev => {
              const filteredPrev = prev.filter(p => !dbStudios.some(d => d.id === p.id));
              return [...dbStudios, ...filteredPrev];
            });
          }
          if (dbModels.length > 0) {
            setModels(prev => {
              const filteredPrev = prev.filter(p => !dbModels.some(d => d.id === p.id));
              return [...dbModels, ...filteredPrev];
            });
          }
          if (dbGear.length > 0) {
            setGear(prev => {
              const filteredPrev = prev.filter(p => !dbGear.some(d => d.id === p.id));
              return [...dbGear, ...filteredPrev];
            });
          }
          if (dbWorkshops.length > 0) {
            setWorkshops(prev => {
              const filteredPrev = prev.filter(p => !dbWorkshops.some(d => d.id === p.id));
              return [...dbWorkshops, ...filteredPrev];
            });
          }
          if (dbJobs.length > 0) {
            setJobs(prev => {
              const filteredPrev = prev.filter(p => !dbJobs.some(d => d.id === p.id));
              return [...dbJobs, ...filteredPrev];
            });
          }
        }
      })
      .catch(err => console.warn('Failed to load listings from DB:', err));
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
    setSelectedDate('19 SUN');
    setSelectedTime('11:00 AM');
  };

  // Book Item action
  const handleBookingSubmit = (autoClose = true) => {
    if (!selectedItem) return;

    let cost = selectedItem.price || 'Free';

    const dbBooking = {
      listingId: selectedItem.id || selectedItem._id || "",
      clientId: activeProfileId || "prof-client",
      creatorId: selectedItem.ownerId || (selectedItemType === "service" ? "prof-photographer" : (selectedItemType === "institute" ? "admin" : "prof-1")),
      ownerId: selectedItem.ownerId || (selectedItemType === "service" ? "prof-photographer" : (selectedItemType === "institute" ? "admin" : "prof-1")),
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbBooking)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save booking");
        return res.json();
      })
      .then(savedBooking => {
        const mappedBooking = { 
          ...savedBooking, 
          id: savedBooking._id,
          ownerId: savedBooking.ownerId || savedBooking.creatorId
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
      headers: { 'Content-Type': 'application/json' },
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
  const sendChatMessage = (sessionId, text) => {
    const newMsg = {
      id: `m-${Date.now()}`,
      sessionId,
      senderId: activeProfileId,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatSessions(prev => prev.map(s => s.id === sessionId ? { ...s, lastMessage: text, lastUpdated: "Just now" } : s));
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

  // Authenticate user session
  const loginUser = (email, password, demoProfileId = null) => {
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
        setCurrentUser(foundProfile);
        setActiveProfileId(foundProfile.id);
        setIsAuthenticated(true);
        // Sync role based on user profile
        setCurrentRole(getMappedRole(foundProfile));
        triggerToast(`Welcome back, ${foundProfile.name}!`);
        return true;
      }
      return false;
    }

    const foundProfile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (foundProfile) {
      setCurrentUser(foundProfile);
      setActiveProfileId(foundProfile.id);
      setIsAuthenticated(true);
      setCurrentRole(getMappedRole(foundProfile));
      triggerToast(`Welcome back, ${foundProfile.name}!`);
      return true;
    } else {
      triggerToast("Invalid credentials. Try using a demo login!");
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
      views: "1"
    };

    setProfiles(prev => [...prev, newProfile]);
    setCurrentUser(newProfile);
    setActiveProfileId(newProfileId);
    setIsAuthenticated(true);
    
    // Set correct role
    if (role === 'admin') {
      setCurrentRole('admin');
    } else if (role === 'photographer') {
      setCurrentRole('photographer');
    } else {
      setCurrentRole('client');
    }
    
    // Sync with backend
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfile)
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
      setCurrentUser(existing);
      setActiveProfileId(existing.id);
      setIsAuthenticated(true);
      
      const roleLower = existing.role.toLowerCase();
      if (roleLower.includes('admin')) setCurrentRole('admin');
      else if (roleLower.includes('photographer')) setCurrentRole('photographer');
      else setCurrentRole('client');
      
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
        views: "1"
      };

      setProfiles(prev => [...prev, newProfile]);
      setCurrentUser(newProfile);
      setActiveProfileId(newProfileId);
      setIsAuthenticated(true);
      setCurrentRole(role);

      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
      toggleCouponStatus, createCoupon
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
