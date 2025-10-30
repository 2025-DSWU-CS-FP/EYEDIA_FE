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

let isRedirecting = false;

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

    const data = error.response?.data;
    const serverMsg = hasMessage(data) ? data.message : undefined;

    if (status === 403 && !skipRedirect && !isRedirecting) {
      showGlobalToast(
        serverMsg ?? '세션이 만료되었어요. 다시 로그인해 주세요.',
        'error',
      );
      isRedirecting = true;
      redirectToLogin();
      return Promise.reject(error);
    }

    if (
      typeof status === 'number' &&
      status >= 500 &&
      status < 600 &&
      !skipRedirect &&
      !isRedirecting
    ) {
      showGlobalToast(
        serverMsg ?? '서버 오류가 발생했습니다. 다시 로그인해 주세요.',
        'error',
      );
      isRedirecting = true;
      redirectToLogin();
      return Promise.reject(error);
    }

    if (status === undefined && !skipRedirect && !isRedirecting) {
      isRedirecting = true;
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
