import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('fleet_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem('fleet_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role = 'admin') => {
    // In a real app, you would make an API call here
    // This is a mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          // Extract username from email (before @)
          const username = email.split('@')[0];
          
          // Check if this is a driver login attempt
          const isDriverLogin = role === 'driver' || 
            localStorage.getItem('driver_auth_token') || 
            email.includes('driver');
          
          const mockUser = {
            id: isDriverLogin ? 'driver_1' : '1',
            name: username,
            email: email,
            role: isDriverLogin ? 'driver' : 'admin',
            avatar: null,
            portal: isDriverLogin ? 'driver' : 'admin'
          };
          
          setUser(mockUser);
          localStorage.setItem('fleet_user', JSON.stringify(mockUser));
          
          // Set appropriate auth token
          if (isDriverLogin) {
            localStorage.setItem('driver_auth_token', 'demo_token_' + Date.now());
          } else {
            localStorage.setItem('admin_auth_token', 'demo_token_' + Date.now());
          }
          
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = async () => {
    // In a real app, you would make an API call here
    return new Promise((resolve) => {
      setUser(null);
      localStorage.removeItem('fleet_user');
      localStorage.removeItem('driver_auth_token');
      localStorage.removeItem('admin_auth_token');
      resolve();
    });
  };

  const updateProfile = async (updates) => {
    // In a real app, you would make an API call here
    return new Promise((resolve) => {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('fleet_user', JSON.stringify(updatedUser));
      resolve(updatedUser);
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
