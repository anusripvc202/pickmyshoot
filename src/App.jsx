import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CreatePage from './pages/CreatePage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import PhotographerDashboard from './pages/PhotographerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useAppContext } from './context/AppContext';

// Simple Route Guarding Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="create" element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        
        {/* Role-Specific Dashboards */}
        <Route path="dashboard/client" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
        <Route path="dashboard/photographer" element={<ProtectedRoute><PhotographerDashboard /></ProtectedRoute>} />
        <Route path="dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
