import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Portfolio, PortfolioRequest } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private apiUrl = `${environment.apiUrl}/portfolios`;

  constructor(private http: HttpClient) {}

  getMyPortfolios(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.apiUrl}/me`);
  }

  getByCandidateId(candidateId: number): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.apiUrl}/candidate/${candidateId}`);
  }

  create(request: PortfolioRequest): Observable<Portfolio> {
    return this.http.post<Portfolio>(this.apiUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}