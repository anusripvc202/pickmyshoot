import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [theme, setTheme] = useState('light');

  // 1. Multi-Profile Global States
  const [profiles, setProfiles] = useState([
    {
      id: "prof-client",
      name: "Amit Sharma",
      role: "Client / Content Creator",
      email: "amit.sharma@pickmyshoot.com",
      phone: "+91 99999 77777",
      bio: "Creative director & indie producer based in Hyderabad. Booking studios, hiring fashion models, and searching for talented photographers for corporate shoots.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=180&q=80",
      shoots: "12 Gigs",
      rating: "4.8 ★",
      followers: "120",
      revenue: "₹45,000 spent",
      success: "100%",
      views: "182"
    },
    {
      id: "prof-photographer",
      name: "Ananya Wedding Shoot",
      role: "Verified Photographer",
      email: "ananya.wedding@pickmyshoot.com",
      phone: "+91 87654 32109",
      bio: "Candid wedding & bridal catalog photographer. Documenting timeless love stories through cinematic lens across Hyderabad.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80",
      shoots: "85+",
      rating: "4.8 ★",
      followers: "8.2K",
      revenue: "₹76,500",
      success: "98.5%",
      views: "640"
    },
    {
      id: "prof-admin",
      name: "Deepak Raj",
      role: "System Administrator",
      email: "deepak.admin@pickmyshoot.com",
      phone: "+91 98888 11111",
      bio: "Platform operations lead and admin manager at PickMyShoot. Reviewing vendor verification, payouts, and listings moderation.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=180&q=80",
      shoots: "All Platform",
      rating: "5.0 ★",
      followers: "1",
      revenue: "₹2,19,300 Volume",
      success: "100%",
      views: "1,200"
    },
    {
      id: "prof-1",
      name: "Dev Creator Workspace",
      role: "Verified Studio Partner",
      email: "creator.workspace@pickmyshoot.com",
      phone: "+91 98765 43210",
      bio: "Premium visual productions hub & studio lot manager. Hosting state-of-the-art camera rentals, lighting packages, and fashion models portfolios across South India.",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=180&q=80",
      shoots: "120+",
      rating: "4.9 ★",
      followers: "15K",
      revenue: "₹1,42,800",
      success: "99.2%",
      views: "1,284"
    }
  ]);

  const [activeProfileId, setActiveProfileId] = useState("prof-client");
  const [currentRole, setCurrentRole] = useState('client');

  // 1.5 Authentication Global States
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: "prof-client",
    name: "Amit Sharma",
    role: "Client / Content Creator",
    email: "amit.sharma@pickmyshoot.com",
    phone: "+91 99999 77777",
    bio: "Creative director & indie producer based in Hyderabad. Booking studios, hiring fashion models, and searching for talented photographers for corporate shoots.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=180&q=80",
    shoots: "12 Gigs",
    rating: "4.8 ★",
    followers: "120",
    revenue: "₹45,000 spent",
    success: "100%",
    views: "182"
  });

  // Sync currentUser details when profiles list is edited
  useEffect(() => {
    if (currentUser) {
      const updatedUser = profiles.find(p => p.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [profiles, currentUser]);
  
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

  // Bookings list state (with cross-linked clients and owners)
  const [bookings, setBookings] = useState([
    {
      id: "b-prev-1",
      clientId: "prof-client",
      ownerId: "prof-photographer",
      item: initialServices[0], // Pre Wedding Shoot
      itemType: "Service",
      date: "20 MON",
      time: "11:00 AM",
      price: 12999,
      status: "confirmed"
    },
    {
      id: "b-prev-2",
      clientId: "prof-client",
      ownerId: "prof-1", // Dev Creator Workspace
      item: initialStudios[0], // The Loft Studio
      itemType: "Studio",
      date: "18 SAT",
      time: "09:00 AM",
      price: 1500,
      status: "confirmed"
    },
    {
      id: "b-prev-3",
      clientId: "prof-client",
      ownerId: "prof-photographer",
      item: initialServices[8], // Fashion Catalog Shoot
      itemType: "Service",
      date: "15 THU",
      time: "02:00 PM",
      price: 14999,
      status: "completed"
    }
  ]);
  const [bookingFilter, setBookingFilter] = useState('upcoming');

  // Liked items state (ID -> boolean map)
  const [likedItems, setLikedItems] = useState({
    "st-1": true,
    "gr-1": true,
    "ps-1": false
  });

  // Support Tickets State
  const [tickets, setTickets] = useState([
    { id: "t-1", clientId: "prof-client", category: "Booking Issue", subject: "Rescheduling studio booking", status: "open", message: "Hi, I need to reschedule my session at Loft Studio.", date: "2026-06-19" },
    { id: "t-2", clientId: "prof-client", category: "Billing Refund", subject: "Refund for cancelled shoot", status: "resolved", message: "My booking b-prev-3 was completed but I had an extra charge.", date: "2026-06-18" }
  ]);

  // Chats / Messaging State
  const [chatSessions, setChatSessions] = useState([
    { id: "ch-1", participantIds: ["prof-client", "prof-photographer"], lastMessage: "Yes, I will be there by 10 AM.", lastUpdated: "10:30 AM" },
    { id: "ch-2", participantIds: ["prof-client", "prof-1"], lastMessage: "The booking is confirmed. Lighting setup is ready.", lastUpdated: "Yesterday" }
  ]);
  const [chatMessages, setChatMessages] = useState([
    { id: "m-1", sessionId: "ch-1", senderId: "prof-client", text: "Hi Ananya, just checking on our shoot tomorrow.", time: "10:15 AM" },
    { id: "m-2", sessionId: "ch-1", senderId: "prof-photographer", text: "Hi Amit! Yes, all preparations are done from my end.", time: "10:20 AM" },
    { id: "m-3", sessionId: "ch-1", senderId: "prof-client", text: "Awesome, should I bring any specific outfit?", time: "10:22 AM" },
    { id: "m-4", sessionId: "ch-1", senderId: "prof-photographer", text: "Yes, I will be there by 10 AM. Standard casuals will work fine.", time: "10:30 AM" },
    
    { id: "m-5", sessionId: "ch-2", senderId: "prof-client", text: "Is the lighting equipment included in the studio package?", time: "Yesterday" },
    { id: "m-6", sessionId: "ch-2", senderId: "prof-1", text: "The booking is confirmed. Lighting setup is ready.", time: "Yesterday" }
  ]);

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

  // Toggle Like state
  const toggleLike = (id, e) => {
    if (e) e.stopPropagation();
    setLikedItems(prev => {
      const nextState = !prev[id];
      triggerToast(nextState ? "Added to favorites!" : "Removed from favorites");
      return { ...prev, [id]: nextState };
    });
  };

  // Open detail modal
  const openDetails = (item, type) => {
    setSelectedItem(item);
    setSelectedItemType(type);
    setSelectedDate('19 SUN');
    setSelectedTime('11:00 AM');
  };

  // Book Item action
  const handleBookingSubmit = (autoClose = true) => {
    if (!selectedItem) return;

    let cost = selectedItem.price;

    const newBooking = {
      id: `b-${Date.now()}`,
      clientId: activeProfileId || "prof-client",
      ownerId: selectedItem.ownerId || (selectedItemType === "service" ? "prof-photographer" : "prof-1"),
      item: selectedItem,
      itemType: selectedItemType.charAt(0).toUpperCase() + selectedItemType.slice(1),
      date: selectedItemType === 'workshop' ? selectedItem.date : selectedDate,
      time: selectedItemType === 'workshop' ? selectedItem.timing : selectedTime,
      price: cost,
      status: "confirmed"
    };

    setBookings(prev => [newBooking, ...prev]);
    if (autoClose) {
      setSelectedItem(null);
    }
    triggerToast(`Booking confirmed for ${selectedItem.title}!`);
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
    let targetProfileId = "prof-client";
    if (newRole === 'photographer') targetProfileId = "prof-photographer";
    if (newRole === 'admin') targetProfileId = "prof-admin";

    const found = profiles.find(p => p.id === targetProfileId);
    if (found) {
      setCurrentUser(found);
      setActiveProfileId(found.id);
      setIsAuthenticated(true);
      triggerToast(`Switched to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} Workspace`);
    }
  };

  // Update booking status helper
  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    triggerToast(`Booking status marked as ${newStatus}`);
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
    if (demoProfileId) {
      const foundProfile = profiles.find(p => p.id === demoProfileId);
      if (foundProfile) {
        setCurrentUser(foundProfile);
        setActiveProfileId(foundProfile.id);
        setIsAuthenticated(true);
        // Sync role based on user profile
        if (foundProfile.id === 'prof-client') setCurrentRole('client');
        else if (foundProfile.id === 'prof-photographer') setCurrentRole('photographer');
        else if (foundProfile.id === 'prof-admin') setCurrentRole('admin');
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
      if (foundProfile.id === 'prof-client') setCurrentRole('client');
      else if (foundProfile.id === 'prof-photographer') setCurrentRole('photographer');
      else if (foundProfile.id === 'prof-admin') setCurrentRole('admin');
      triggerToast(`Welcome back, ${foundProfile.name}!`);
      return true;
    } else {
      triggerToast("Invalid credentials. Try using a demo login!");
      return false;
    }
  };

  // Register new profile and auto-login
  const signupUser = (name, email, password, role) => {
    const newProfileId = `prof-${Date.now()}`;
    const newProfile = {
      id: newProfileId,
      name: name,
      role: role || "Verified Photographer",
      email: email,
      phone: "+91 99999 88888",
      bio: "Newly registered visual creator profile.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80",
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
    setCurrentRole(role.toLowerCase().includes('photographer') ? 'photographer' : 'client');
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
