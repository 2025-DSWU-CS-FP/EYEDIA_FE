import axiosInstance from '@/services/axiosInstance';
import type {
  ConfirmPaintingResponse,
  SignupRequest,
  LoginRequest,
  LoginResponse,
} from '@/types';

const mutationFactory = {
  signup: async (data: SignupRequest) => {
    const res = await axiosInstance.post('/api/v1/auth/signup', data);
    return res.data;
  },
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await axiosInstance.post('/api/v1/auth/login', data);
    const { token } = res.data;
    localStorage.setItem('accessToken', token);
    return res.data;
  },
  confirmPainting: async (
    paintingId: number,
  ): Promise<ConfirmPaintingResponse> => {
    const res = await axiosInstance.post(
      `/api/v1/paintings/${paintingId}/confirm`,
    );
    return res.data;
  },
};

export default mutationFactory;
