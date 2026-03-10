import axiosInstance from '@/lib/axios';

// Product APIs
export const getProducts = async (params = {}) => {
  const { data } = await axiosInstance.get('/products', { params });
  return data;
};

export const getProductById = async (id: string) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
};

export const addProduct = (productData: object) => 
  axiosInstance.post('/create-product', productData);

// Category APIs
export const getCategories = async () => {
  const { data } = await axiosInstance.get('/categories');
  return data;
};

export const createCategory = async (formData: FormData) => {
  const { data } = await axiosInstance.post('/create-category', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};