export interface LoginRequest {
  id: string;
  pw: string;
}

export interface LoginResponse {
  token: string;
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
