import axiosInstance from '@/lib/axios';

export const createCheckoutSession = async (paymentData: object) => {
  const { data } = await axiosInstance.post('/orders/create-checkout-session', paymentData);
  return data;
};

export const getUserOrders = async () => {
  const { data } = await axiosInstance.get('/orders/my-orders');
  return data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data } = await axiosInstance.patch(`/orders/update-order-status/${orderId}`, { status });
  return data;
};



export const getOrderDetailsByTranId = async (tranId:string) => {
  const response = await axiosInstance.get(`/orders/${tranId}`);
  return response.data;


};

export const getAllOrders = async (params = {}) => {
  const response = await axiosInstance.get('/orders/all-orders', { params });
  return response.data;
};