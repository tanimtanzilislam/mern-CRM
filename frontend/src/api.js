import axios from 'axios';

// Set VITE_API_URL in Vercel to the deployed backend URL.
const API_BASE_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getCustomers = () => api.get('/customers');
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
export const getProducts = () => api.get('/products');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const login = (data) => api.post('/auth/login', data);
export const registerFirstAdmin = (data) => api.post('/auth/register', data);
export const getUsers = () => api.get('/auth/users');
export const createUser = (data) => api.post('/auth/users', data);
export const updateUserRole = (id, role) => api.patch(`/auth/users/${id}/role`, { role });
export const getOrders = () => api.get('/orders');
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.patch(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export default api;
