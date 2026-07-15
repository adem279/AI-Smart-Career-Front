export interface Education {
  id: number;
  university: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface EducationRequest {
  university: string;
  degree: string;
  startDate: string;
  endDate: string;
}