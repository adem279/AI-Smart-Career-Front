import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisterCandidateRequest, RegisterCompanyRequest, LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  registerCandidate(request: RegisterCandidateRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register/candidate`, request)
      .pipe(tap(response => this.storeSession(response)));
  }

  registerCompany(request: RegisterCompanyRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register/company`, request)
      .pipe(tap(response => this.storeSession(response)));
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap(response => this.storeSession(response)));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private storeSession(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('userType', response.userType);
  }
}