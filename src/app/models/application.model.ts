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
  resumeId: number | null;
  resumeFileName: string | null;
  resumeFilePath: string | null;
}

export interface ApplicationRequest {
  jobOfferId: number;
  message: string;
  resumeId: number | null;
}