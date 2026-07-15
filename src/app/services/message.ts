import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message, MessageRequest } from '../models/message.model';
import { Conversation } from '../models/conversation.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  send(request: MessageRequest): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, request);
  }

  getConversation(applicationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/application/${applicationId}`);
  }

  markAsRead(applicationId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/application/${applicationId}/read`, {});
  }

  getMyConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`);
  }
}