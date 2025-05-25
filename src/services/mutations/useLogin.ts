import { useMutation } from '@tanstack/react-query';

import axiosInstance from '@/services/axiosInstance';
import type { LoginRequest, LoginResponse } from '@/types/auth';

const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const res = await axiosInstance.post('/api/v1/auth/login', data);
      return res.data;
    },
  });
};

export default useLogin;
