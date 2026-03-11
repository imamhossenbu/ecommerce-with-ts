import axiosInstance from '@/lib/axios';

export const getAdminStats = async () => {
  const { data } = await axiosInstance.get('/admin/stats');
  return data.data;
};

export const getManageCustomers = async (params = {}) => {
  const { data } = await axiosInstance.get('/admin/manage-customers', { params });
  return data;
};

export const updateProfileByAdmin = async (data:object) => {
  const response = await axiosInstance.patch(`/admin/update-profile`, data);
  return response.data;
};

export const deleteUser = async (id:string) => {
    const response = await axiosInstance.delete(`/admin/delete-user/${id}`);
    return response.data;
};


// export const updateAdminSettings = async (settingsData) => {
//   const response = await axiosInstance.put('/admin/update-settings', settingsData);
//   return response.data;
// };