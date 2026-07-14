export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  id: number;
  applicationDate: string;
  status: ApplicationStatus;
  message: string;
  candidateId: number;
  candidateName: string;
  jobOfferId: number;
  jobOfferTitle: string;
}

export interface ApplicationRequest {
  jobOfferId: number;
  message: string;
}