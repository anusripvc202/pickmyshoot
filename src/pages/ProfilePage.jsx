import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProfilePage = () => {
  const { currentRole } = useAppContext();

  // Smart routing based on current logged in user role
  if (currentRole === 'photographer') {
    return <Navigate to="/dashboard/photographer" replace />;
  } else if (currentRole === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  } else {
    return <Navigate to="/dashboard/client" replace />;
  }
};

export default ProfilePage;
