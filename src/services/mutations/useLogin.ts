import { useMutation } from '@tanstack/react-query';

import mutationFactory from '@/services/mutationFactory';
import type { LoginRequest, LoginResponse } from '@/types/auth';

const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: data => mutationFactory.login(data),
  });
};

export default useLogin;
