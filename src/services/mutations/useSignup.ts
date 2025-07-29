import { useMutation } from '@tanstack/react-query';

import mutationFactory from '@/services/mutationFactory';
import type { SignupRequest } from '@/types/auth';

const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => mutationFactory.signup(data),
  });
};

export default useSignup;
