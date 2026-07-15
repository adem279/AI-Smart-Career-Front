export interface Message {
  id: number;
  applicationId: number;
  senderId: number;
  senderType: 'CANDIDATE' | 'COMPANY';
  senderName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface MessageRequest {
  applicationId: number;
  content: string;
}