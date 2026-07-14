export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  companyId: number;
  companyName: string;
  candidateId: number;
  candidateName: string;
}

export interface ReviewRequest {
  candidateId: number;
  rating: number;
  comment: string;
}