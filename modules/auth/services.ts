import axiosInstance from '@/lib/axios';
import { AuthResponse } from './types';

export const loginUser = async (credentials: object): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  return data;
};

export const registerUser = async (userData: object): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post('/auth/register', userData);
  return data;
};

export const updateProfile = async (formData: FormData) => {
  const { data } = await axiosInstance.put('/auth/update-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const forgetPassword = (email: string) => 
  axiosInstance.post('/auth/forget-password', { email });

export const resetPassword = (token: string, password: string) => 
  axiosInstance.put(`/auth/reset-password/${token}`, { password });