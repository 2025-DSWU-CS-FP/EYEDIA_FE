import { useMutation } from '@tanstack/react-query';

import axiosInstance from '@/services/axiosInstance';

interface ConfirmPaintingResponse {
  chatRoomId: number;
  aiPaintingId: number;
  confirmed: boolean;
  message: string;
}

const useConfirmPainting = () => {
  return useMutation({
    mutationFn: async (
      paintingId: number,
    ): Promise<ConfirmPaintingResponse> => {
      const res = await axiosInstance.post(
        `/api/v1/paintings/${paintingId}/confirm`,
      );
      return res.data;
    },
  });
};

export default useConfirmPainting;
