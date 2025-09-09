import { useMutation } from '@tanstack/react-query';

import mutationFactory from '@/services/mutationFactory';
import type { SaveScrapRequest, SaveScrapResponse } from '@/types/scrap';

export default function useSaveScrap() {
  return useMutation<SaveScrapResponse, Error, SaveScrapRequest>({
    mutationFn: data => mutationFactory.saveScrap(data),
  });
}
