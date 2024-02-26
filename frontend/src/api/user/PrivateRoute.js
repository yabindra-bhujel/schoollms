import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const getUserData = () => {
    const userDataJson = localStorage.getItem('userData');
    return userDataJson ? JSON.parse(userDataJson) : null;
  };

  const isLoggedIn = () => {
    const userData = getUserData();
    if (!userData) return false;

    try {
      const decodedToken = jwtDecode(userData.access);
      const isTokenExpired = decodedToken.exp < Date.now() / 1000;
      return !isTokenExpired;
    } catch {
      return false;
    }
  };

  const hasRequiredRole = () => {
    const userData = getUserData();
    if (!userData) return false;

    return allowedRoles.some(role => {
      if (role === 'staff') return userData.is_staff;
      if (role === 'superuser') return userData.is_superuser;
      return userData[`is${role.charAt(0).toUpperCase() + role.slice(1)}`];
    });
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      <Navigate to="/login" />;
    }
  }, []);


  return isLoggedIn() && hasRequiredRole() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
