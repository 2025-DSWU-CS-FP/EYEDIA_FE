import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import redirectToLogin from '@/utils/authRedirect';
import { showGlobalToast } from '@/utils/toastBus';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

type UnknownRecord = Record<string, unknown>;

function hasMessage(x: unknown): x is { message: string } {
  return (
    typeof x === 'object' &&
    x !== null &&
    'message' in (x as UnknownRecord) &&
    typeof (x as UnknownRecord).message === 'string'
  );
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers?.set?.('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  res => res,
  (error: AxiosError<unknown>) => {
    const status = error.response?.status;
    const url = String(error.config?.url ?? '');

    const skipRedirect =
      url.includes('/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/token/refresh');
    if (status === 403 && !skipRedirect) {
      const data = error.response?.data;
      const serverMsg = hasMessage(data)
        ? data.message
        : '세션이 만료되었어요. 다시 로그인해 주세요.';
      showGlobalToast(serverMsg, 'error');
      redirectToLogin();
    }

    if (status === undefined) {
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
