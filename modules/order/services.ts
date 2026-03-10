import axiosInstance from '@/lib/axios';

export const createCheckoutSession = async (paymentData: object) => {
  const { data } = await axiosInstance.post('/orders/create-checkout-session', paymentData);
  return data;
};

export const getUserOrders = async () => {
  const { data } = await axiosInstance.get('/payment/my-orders');
  return data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data } = await axiosInstance.patch(`/payment/update-order-status/${orderId}`, { status });
  return data;
};