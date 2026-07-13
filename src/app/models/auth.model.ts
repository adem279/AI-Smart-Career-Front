export interface RegisterCandidateRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterCompanyRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  companyName: string;
  sector?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  userType: 'CANDIDATE' | 'COMPANY';
}