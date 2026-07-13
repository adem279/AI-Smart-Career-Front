export type JobType = 'INTERNSHIP' | 'FREELANCE' | 'PART_TIME' | 'FULL_TIME';
export type ExperienceLevel = 'JUNIOR' | 'MID_LEVEL' | 'SENIOR';
export type JobOfferStatus = 'OPEN' | 'CLOSED' | 'DRAFT';

export interface JobOffer {
  id: number;
  title: string;
  description: string;
  salary: number | null;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  deadline: string;
  status: JobOfferStatus;
  companyId: number;
  companyName: string;
}

export interface JobOfferRequest {
  title: string;
  description: string;
  salary: number | null;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  deadline: string;
}