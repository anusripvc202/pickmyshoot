import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CreatePage from './pages/CreatePage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ClientDashboard from './pages/ClientDashboard';
import PhotographerDashboard from './pages/PhotographerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import PhotographerProfilePage from './pages/PhotographerProfilePage';
import ModelProfilePage from './pages/ModelProfilePage';
import JobDetailsPage from './pages/JobDetailsPage';
import { useAppContext } from './context/AppContext';

// Redirect to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Redirect to the correct dashboard if the user's role doesn't match
const RoleRoute = ({ allowedRole, children }) => {
  const { isAuthenticated, currentRole } = useAppContext();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = currentRole;

  // Exact role match — render the page
  if (role === allowedRole) return children;

  // Wrong role — send them to their own dashboard
  if (role === 'admin')        return <Navigate to="/dashboard/admin"        replace />;
  if (role === 'photographer') return <Navigate to="/dashboard/photographer" replace />;
  return                                <Navigate to="/dashboard/client"      replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="explore"  element={<ExplorePage />} />
        <Route path="photographer/:id" element={<PhotographerProfilePage />} />
        <Route path="model/:id" element={<ModelProfilePage />} />
        <Route path="job/:id" element={<JobDetailsPage />} />
        <Route path="login"    element={<LoginPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="blog"     element={<BlogPage />} />
        <Route path="about"    element={<AboutPage />} />
        <Route path="contact"  element={<ContactPage />} />
        <Route path="faq"      element={<FaqPage />} />

        {/* Protected Routes */}
        <Route path="create"   element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Role-Specific Dashboards — each locked to correct role */}
        <Route path="dashboard/client"       element={<RoleRoute allowedRole="client"><ClientDashboard /></RoleRoute>} />
        <Route path="dashboard/photographer" element={<RoleRoute allowedRole="photographer"><PhotographerDashboard /></RoleRoute>} />
        <Route path="dashboard/admin"        element={<RoleRoute allowedRole="admin"><AdminDashboard /></RoleRoute>} />
      </Route>
    </Routes>
  );
}

export default App;

