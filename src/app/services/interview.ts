import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Interview, InterviewRequest } from '../models/interview.model';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = `${environment.apiUrl}/interviews`;

  constructor(private http: HttpClient) {}

  schedule(applicationId: number, request: InterviewRequest): Observable<Interview> {
    return this.http.post<Interview>(`${this.apiUrl}/application/${applicationId}`, request);
  }

  getByApplicationId(applicationId: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.apiUrl}/application/${applicationId}`);
  }

  setResult(id: number, result: string): Observable<Interview> {
    return this.http.patch<Interview>(`${this.apiUrl}/${id}/result?result=${encodeURIComponent(result)}`, {});
  }

  cancel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}