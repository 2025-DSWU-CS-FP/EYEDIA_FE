import { Gender } from './auth';

export interface UserInfo {
  username: string;
  age: number;
  gender: Gender;
  id: string;
}

export interface VerifyPasswordResult {
  verified: boolean;
  userInfo: UserInfo;
}

export interface VerifyPasswordResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: VerifyPasswordResult;
}
