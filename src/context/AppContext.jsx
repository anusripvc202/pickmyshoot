import { createContext, useContext, useState, useEffect } from 'react';
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
      id: "prof-1",
      name: "Dev Creator Workspace",
      role: "Verified Studio Partner",
      email: "creator.workspace@pickmyshoot.com",
      phone: "+91 98765 43210",
      bio: "Premium visual productions hub & studio lot manager. Hosting state-of-the-art camera rentals, lighting packages, and fashion models portfolios across South India.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=180&q=80",
      shoots: "120+",
      rating: "4.9 ★",
      followers: "15K",
      revenue: "₹1,42,800",
      success: "99.2%",
      views: "1,284"
    },
    {
      id: "prof-2",
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
    }
  ]);

  const [activeProfileId, setActiveProfileId] = useState("prof-1");

  // 1.5 Authentication Global States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreTab, setExploreTab] = useState('services');

  // Bookings list state
  const [bookings, setBookings] = useState([
    {
      id: "b-prev-1",
      item: initialStudios[0], // The Loft Studio
      itemType: "Studio",
      date: "18 SAT",
      time: "09:00 AM",
      price: 1500,
      status: "confirmed"
    }
  ]);
  const [bookingFilter, setBookingFilter] = useState('upcoming');

  // Liked items state (ID -> boolean map)
  const [likedItems, setLikedItems] = useState({
    "st-1": true,
    "gr-1": true,
    "ps-1": false
  });

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
  const handleBookingSubmit = () => {
    if (!selectedItem) return;

    let cost = selectedItem.price;

    const newBooking = {
      id: `b-${Date.now()}`,
      item: selectedItem,
      itemType: selectedItemType.charAt(0).toUpperCase() + selectedItemType.slice(1),
      date: selectedItemType === 'workshop' ? selectedItem.date : selectedDate,
      time: selectedItemType === 'workshop' ? selectedItem.timing : selectedTime,
      price: cost,
      status: "confirmed"
    };

    setBookings(prev => [newBooking, ...prev]);
    setSelectedItem(null);
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

  // Authenticate user session
  const loginUser = (email, password, demoProfileId = null) => {
    if (demoProfileId) {
      const foundProfile = profiles.find(p => p.id === demoProfileId);
      if (foundProfile) {
        setCurrentUser(foundProfile);
        setActiveProfileId(foundProfile.id);
        setIsAuthenticated(true);
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
    triggerToast(`Welcome to PickMyShoot, ${name}!`);
    return true;
  };

  // Sign out and destroy session state
  const logoutUser = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
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
      logoutUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
