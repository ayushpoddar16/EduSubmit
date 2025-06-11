// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole'); // Store role separately for reliability
    
    if (token && role) {
      // Try to decode JWT to get user info, but fallback to stored role
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        setUser({
          id: payload.id,
          role: payload.role || role, // Use JWT role if available, otherwise stored role
          token: token
        });
      } catch (error) {
        // If JWT decode fails, use stored role
        console.warn('JWT decode failed, using stored role:', error);
        if (role) {
          setUser({
            role: role,
            token: token
          });
        } else {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (token, role) => {
    // Store both token and role
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    
    // Try to get additional info from JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ 
        id: payload.id,
        role: role, // Use the role from backend response (more reliable)
        token: token 
      });
    } catch (error) {
      // If JWT decode fails, just use the provided role
      console.warn('JWT decode failed during login, using provided role:', error);
      setUser({ 
        role: role, 
        token: token 
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};