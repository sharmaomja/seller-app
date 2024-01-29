import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Add state for user details


  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Handle parsing error or clear the incorrect localStorage data
      }
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('user', JSON.stringify(user)); // Convert user object to JSON string
    setUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user'); // Remove user details
    setUser(null); // Reset user details
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
