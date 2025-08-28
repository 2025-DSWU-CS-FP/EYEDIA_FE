export interface LoginRequest {
  id: string;
  pw: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface SignupRequest {
  id: string;
  pw: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  profileImage?: string;
  currentLocation?: string;
}

export type GenderStrict = 'MALE' | 'FEMALE';
export type Gender = '' | GenderStrict;

export interface Terms {
  all: boolean;
  privacy: boolean;
  age: boolean;
  marketing: boolean;
}

export const isGenderStrict = (g: Gender): g is GenderStrict =>
  g === 'MALE' || g === 'FEMALE';
