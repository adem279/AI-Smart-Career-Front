import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Candidate, CandidateUpdateRequest } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = `${environment.apiUrl}/candidates`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/me`);
  }

  updateMyProfile(request: CandidateUpdateRequest): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/me`, request);
  }
}