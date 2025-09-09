import { useMutation } from '@tanstack/react-query';

import mutationFactory, {
  type CommonResponse,
} from '@/services/mutationFactory';
import type { BadgeEventRequest } from '@/types/badge';

export default function useCreateBadgeEvent() {
  return useMutation<CommonResponse, Error, BadgeEventRequest>({
    mutationFn: data => mutationFactory.createBadgeEvent(data),
  });
}
