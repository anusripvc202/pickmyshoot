import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Wifi, Battery, Signal } from 'lucide-react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CreatePage from './pages/CreatePage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';

// Simulated Phone Wrapper for Desktop Screens
const DesktopPhoneWrapper = () => {
  const [time, setTime] = React.useState('12:00 PM');

  // Clock updater
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000); // Update every 10 seconds is sufficient
    return () => clearInterval(timer);
  }, []);

  // Listen for parent hash navigation (like back/forward buttons) and pass it down to iframe
  React.useEffect(() => {
    const handleParentHashChange = () => {
      const iframe = document.getElementById('phone-app-iframe');
      if (iframe) {
        try {
          if (iframe.contentWindow && iframe.contentWindow.location.hash !== window.location.hash) {
            iframe.contentWindow.location.hash = window.location.hash;
          }
        } catch (e) {
          console.error("Iframe navigation sync failed:", e);
        }
      }
    };
    window.addEventListener('hashchange', handleParentHashChange);
    return () => window.removeEventListener('hashchange', handleParentHashChange);
  }, []);

  // Get initial iframe URL seeding (preserving current hash router page state)
  const iframeSrc = React.useMemo(() => {
    // Avoid infinite loop wrapper by appending a query flag
    const url = new URL(window.location.href);
    url.searchParams.set('embed', 'true');
    return url.toString();
  }, []);

  return (
    <div className="desktop-portal-container">
      
      {/* Realistic Mobile Phone Frame Mockup */}
      <div className="phone-frame-bezel">
        {/* Dynamic Island Notch */}
        <div className="phone-dynamic-island">
          <div className="sensor-lens"></div>
          <div className="camera-lens"></div>
        </div>

        <div className="phone-inner-screen">
          {/* Simulated Status Bar */}
          <div className="phone-status-bar">
            <span className="status-bar-time">{time}</span>
            <div className="status-bar-icons">
              <Signal size={12} strokeWidth={2.5} />
              <Wifi size={12} strokeWidth={2.5} />
              <Battery size={14} strokeWidth={2.5} />
            </div>
          </div>

          {/* Same-origin Iframe containing the actual application */}
          <iframe 
            id="phone-app-iframe"
            title="PickMyShoot Mobile Portal"
            src={iframeSrc} 
            className="phone-iframe-viewport"
          />

          {/* Bottom Swipe Home Indicator */}
          <div className="phone-home-indicator"></div>
        </div>
      </div>

    </div>
  );
};

function App() {
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 480);
  const [isEmbedded, setIsEmbedded] = React.useState(window.self !== window.top);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 480);
      setIsEmbedded(window.self !== window.top);
    };

    window.addEventListener('resize', handleResize);
    // Double check state on mount
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update classes on parent wrapper body when rendering the phone mockup
  React.useEffect(() => {
    if (isDesktop && !isEmbedded) {
      document.body.classList.add('desktop-wrapper-body');
    } else {
      document.body.classList.remove('desktop-wrapper-body');
    }
  }, [isDesktop, isEmbedded]);

  // If on desktop and not embedded, wrap the application inside the iPhone shell
  if (isDesktop && !isEmbedded) {
    return <DesktopPhoneWrapper />;
  }

  // Otherwise, load page routes normally
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="create" element={<CreatePage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
