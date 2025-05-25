import { useMutation } from '@tanstack/react-query';

import axiosInstance from '@/services/axiosInstance';
import type { SignupRequest } from '@/types/auth';

const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupRequest) => {
      const res = await axiosInstance.post('/api/v1/auth/signup', data);
      return res.data;
    },
  });
};

export default useSignup;
