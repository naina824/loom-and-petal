import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crochet_admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('crochet_admin_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest('/auth/me');
        setAdmin(data);
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem('crochet_admin_token');
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('crochet_admin_token', data.token);
    setToken(data.token);
    setAdmin({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    });

    return data;
  };

  const logout = () => {
    localStorage.removeItem('crochet_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
