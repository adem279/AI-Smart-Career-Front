export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  address: string;
  birthDate: string;
  bio: string;
  photo: string;
}

export interface CandidateUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  bio?: string;
  photo?: string;
}