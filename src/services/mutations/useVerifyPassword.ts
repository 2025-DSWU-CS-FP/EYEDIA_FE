import { useMutation } from '@tanstack/react-query';

import mutationFactory from '@/services/mutationFactory';

export default function useVerifyPassword() {
  return useMutation<{ message: string }, Error, string>({
    mutationFn: mutationFactory.verifyPassword,
  });
}
