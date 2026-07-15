import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Experience, ExperienceRequest } from '../models/experience.model';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private apiUrl = `${environment.apiUrl}/experiences`;

  constructor(private http: HttpClient) {}

  getMyExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.apiUrl}/me`);
  }

  getByCandidateId(candidateId: number): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.apiUrl}/candidate/${candidateId}`);
  }

  create(request: ExperienceRequest): Observable<Experience> {
    return this.http.post<Experience>(this.apiUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}