/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import { IReview, CreateReviewData } from './types';


export const getHomeReviews = async (): Promise<{ success: boolean; data: IReview[] }> => {
  const { data } = await axiosInstance.get('/reviews/home-reviews');
  return data;
};


export const getProductReviews = async (productId: string): Promise<{ success: boolean; data: IReview[] }> => {
  const { data } = await axiosInstance.get(`/reviews/get-reviews/${productId}`);
  return data;
};


export const addReview = async (reviewData: CreateReviewData): Promise<{ success: boolean; message: string }> => {
  const { data } = await axiosInstance.post('/reviews/add-review', reviewData);
  return data;
};


export const deleteReview = async (reviewId: string) => {
  const { data } = await axiosInstance.delete(`/reviews/delete-review/${reviewId}`);
  return data;
};