import { useMutation } from '@tanstack/react-query';

import mutationFactory from '@/services/mutationFactory';
import type { VerifyPasswordResult } from '@/types/user';

export default function useVerifyPassword() {
  return useMutation<VerifyPasswordResult, Error, string>({
    mutationFn: password => mutationFactory.verifyPassword(password),
  });
}
