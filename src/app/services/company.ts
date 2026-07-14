import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Company, CompanyUpdateRequest } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/me`);
  }

  updateMyProfile(request: CompanyUpdateRequest): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/me`, request);
  }
}