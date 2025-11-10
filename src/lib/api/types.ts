export interface SignupRequest {
  name: string;
  email: string;
  countryCode: string;
  mobileNo: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  countryCode: string;
  mobileNo: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  isOnboardingDone: boolean;
}

