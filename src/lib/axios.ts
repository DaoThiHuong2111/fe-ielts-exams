import axios, { AxiosResponse } from 'axios';

export const clientService = axios.create({
  baseURL: '', // Gọi đến Next.js API routes (cùng domain)
  withCredentials: true, // Tự động gửi cookies (bao gồm httpOnly)
  timeout: 10000,
});

// Simple request interceptor
clientService.interceptors.request.use(
  (config) => {
    // Browser tự động gửi cookies nhờ withCredentials: true
    return config;
  },
  (error) => Promise.reject(error)
);

// Simple response interceptor - chỉ log lỗi, không xử lý phức tạp
clientService.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Chỉ log lỗi, không xử lý phức tạp để tránh vòng lặp
    if (error.response?.status) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);
