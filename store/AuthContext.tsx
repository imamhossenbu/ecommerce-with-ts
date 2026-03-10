/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../lib/axios'; 
import toast from 'react-hot-toast';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  profileImage?: string;
}


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  register: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  setUser: (userData: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = () => {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUserState(parsedUser);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          } catch (error) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const setUser = (userData: User | null) => {
    if (typeof window !== 'undefined') {
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
      }
    }
    setUserState(userData);
  };

  const setAuthData = (userData: User, token: string) => {
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login: setAuthData, 
      register: setAuthData, 
      logout, 
      setUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;