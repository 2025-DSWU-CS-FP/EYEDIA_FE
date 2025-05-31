import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }

    return config;
  },
  error => Promise.reject(error),
);

export default axiosInstance;
