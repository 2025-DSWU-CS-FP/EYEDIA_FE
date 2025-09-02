import axiosInstance from '@/services/axiosInstance';
import type {
  ConfirmPaintingResponse,
  SignupRequest,
  LoginRequest,
  LoginResponse,
  VerifyPasswordResult,
  VerifyPasswordResponse,
} from '@/types';

export type CommonResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
};

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
  verifyPassword: async (password: string): Promise<VerifyPasswordResult> => {
    const res = await axiosInstance.post<VerifyPasswordResponse>(
      '/api/v1/users/verify-password',
      { password },
    );
    return res.data.result;
  },

  addBookmark: (exhibitionId: number) => async (): Promise<CommonResponse> => {
    const res = await axiosInstance.post(
      `/api/v1/exhibitions/${exhibitionId}/bookmark`,
    );
    return res.data;
  },

  removeBookmark:
    (exhibitionId: number) => async (): Promise<CommonResponse> => {
      const res = await axiosInstance.delete(
        `/api/v1/exhibitions/${exhibitionId}/bookmark`,
      );
      return res.data;
    },
};

export default mutationFactory;
