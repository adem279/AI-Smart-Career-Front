export interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceRequest {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}