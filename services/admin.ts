import axiosInstance from '@/lib/axios';

export const getAdminStats = async () => {
  const { data } = await axiosInstance.get('/admin/stats');
  return data.data;
};

export const getManageCustomers = async (params = {}) => {
  const { data } = await axiosInstance.get('/admin/manage-customers', { params });
  return data;
};