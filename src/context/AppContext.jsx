import React, { createContext, useContext, useState } from 'react';
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
      handleBookingSubmit
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
