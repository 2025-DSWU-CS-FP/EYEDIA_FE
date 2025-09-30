export interface LoginRequest {
  id: string;
  pw: string;
}

export interface LoginResponse {
  token: string;
  firstLogin: boolean;
  monthlyVisitCount: number;
  name: string;
}
export interface SignupRequest {
  id: string;
  pw: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  profileImage?: string;
  currentLocation?: string;
  keywords?: string[];
}

export type Gender = '' | 'MALE' | 'FEMALE';

export interface Terms {
  all: boolean;
  privacy: boolean;
  age: boolean;
  marketing: boolean;
}

export function isGenderStrict(g: Gender): g is 'MALE' | 'FEMALE' {
  return g === 'MALE' || g === 'FEMALE';
}
