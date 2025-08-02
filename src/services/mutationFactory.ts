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
  verifyPassword: async (password: string): Promise<{ message: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === '1234') {
          resolve({ message: '인증 성공' });
        } else {
          reject(new Error('비밀번호가 일치하지 않습니다.'));
        }
      }, 500);
    });
  },
};

export default mutationFactory;
