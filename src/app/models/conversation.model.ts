import { Interview } from './interview.model';

export interface Conversation {
  applicationId: number;
  applicationStatus: string;
  jobOfferId: number;
  jobOfferTitle: string;
  candidateId: number;
  candidateName: string;
  candidatePhoto: string | null;
  companyId: number;
  companyName: string;
  companyLogo: string | null;
  lastMessage: string | null;
  lastMessageDate: string | null;
  unreadCount: number;
  interview: Interview | null;
}