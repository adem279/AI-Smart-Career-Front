import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Education, EducationRequest } from '../models/education.model';

@Injectable({ providedIn: 'root' })
export class EducationService {
  private apiUrl = `${environment.apiUrl}/educations`;

  constructor(private http: HttpClient) {}

  getMyEducations(): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/me`);
  }

  getByCandidateId(candidateId: number): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/candidate/${candidateId}`);
  }

  create(request: EducationRequest): Observable<Education> {
    return this.http.post<Education>(this.apiUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}