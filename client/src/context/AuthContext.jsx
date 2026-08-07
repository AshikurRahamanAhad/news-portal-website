import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Logout handler (declared before useEffect so it can be called safely)
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Check user authentication status on app load
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axiosInstance.get('/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { token: jwtToken, ...userData } = response.data;

    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return response.data;
  };

  // Register handler
  const register = async (name, email, password, role) => {
    const response = await axiosInstance.post('/auth/register', { name, email, password, role });
    const { token: jwtToken, ...userData } = response.data;

    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};