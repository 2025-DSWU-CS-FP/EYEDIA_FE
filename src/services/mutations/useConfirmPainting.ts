import { useMutation } from '@tanstack/react-query';

import mutationFactory from '@/services/mutationFactory';
import type { ConfirmPaintingResponse } from '@/types';

const useConfirmPainting = () => {
  return useMutation<ConfirmPaintingResponse, Error, number>({
    mutationFn: paintingId => mutationFactory.confirmPainting(paintingId),
  });
};

export default useConfirmPainting;
