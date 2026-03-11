/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import { IProduct } from './types';

/**
 * PRODUCT APIS
 */


export const getProducts = async (params = {}) => {
  const { data } = await axiosInstance.get('/products', { params });
  return data;
};


export const getProductById = async (id: string): Promise<{ success: boolean; data: IProduct }> => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
};


export const getBestsellingProducts = async (): Promise<{ success: boolean; data: IProduct[] }> => {
  const response = await axiosInstance.get('/products/bestsellers');
  return response.data;
};


export const getNewArrivals = async (): Promise<{ success: boolean; data: IProduct[] }> => {
  const response = await axiosInstance.get('/products/new-arrivals');
  return response.data;
};


export const addProduct = (productData: object) => 
  axiosInstance.post('/products/create-product', productData);

export const updateProduct = (id: string, data: any) => 
  axiosInstance.put(`/products/${id}`, data);

export const deleteProduct = (id: string) => 
  axiosInstance.delete(`/products/${id}`);


export const addProductImage = async (formData: FormData) => {
  const response = await axiosInstance.post('/uploads/upload-single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

/**
 * CATEGORY APIS
 */

export const getCategories = async () => {
  const { data } = await axiosInstance.get('/categories');
  return data;
};

export const createCategory = async (formData: FormData) => {
  const { data } = await axiosInstance.post('/categories/create-category', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const updateCategory = async (id: string, formData: FormData) => {
  const { data } = await axiosInstance.put(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await axiosInstance.delete(`/categories/${id}`);
  return data;
};