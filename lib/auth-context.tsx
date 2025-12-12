'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, User } from './auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const userData = await authApi.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.register({ name, email, password });
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};