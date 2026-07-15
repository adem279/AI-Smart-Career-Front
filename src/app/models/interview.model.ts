export interface Interview {
  id: number;
  date: string;
  time: string;
  location: string;
  type: string;
  result: string | null;
  meetingLink: string | null;
  applicationId: number;
}

export interface InterviewRequest {
  date: string;
  time: string;
  location: string;
  type: string;
  meetingLink?: string;
}