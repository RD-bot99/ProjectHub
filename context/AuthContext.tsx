'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  updateProfile: (updates: { name?: string; email?: string }) => void;
  updatePassword: (currentPassword: string, newPassword: string) => void;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to restore auth:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { apiClient } = await import('@/lib/api-client');
      const response = await apiClient.login(email, password);
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        avatar_url: response.user.avatar_url,
        roles: response.roles || [],
      };
      
      setUser(user);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, passwordConfirmation: string = password) => {
    setIsLoading(true);
    try {
      const { apiClient } = await import('@/lib/api-client');
      const response = await apiClient.register(name, email, password, passwordConfirmation);
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        avatar_url: response.user.avatar_url,
        roles: response.roles || [],
      };
      
      setUser(user);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) ?? false;
  };

  const updateProfile = (updates: { name?: string; email?: string }) => {
    if (user) {
      const updatedUser = {
        ...user,
        name: updates.name || user.name,
        email: updates.email || user.email,
      };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const updatePassword = (currentPassword: string, newPassword: string) => {
    // In a real app, this would validate against the backend
    // For now, we'll do basic validation
    if (!currentPassword || !newPassword) {
      throw new Error('Current and new password are required');
    }
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }
    // Store password hash in localStorage (not secure - for demo only)
    localStorage.setItem('user_password_hash', btoa(newPassword));
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    hasRole,
    updateProfile,
    updatePassword,
    role: user?.roles[0] || 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
