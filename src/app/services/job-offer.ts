import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobOffer, JobOfferRequest } from '../models/job-offer.model';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private apiUrl = `${environment.apiUrl}/job-offers`;

  constructor(private http: HttpClient) {}

  getAllOpen(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(this.apiUrl);
  }

  getById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.apiUrl}/${id}`);
  }

  getMyJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/me`);
  }

  create(request: JobOfferRequest): Observable<JobOffer> {
    return this.http.post<JobOffer>(this.apiUrl, request);
  }

  update(id: number, request: JobOfferRequest): Observable<JobOffer> {
    return this.http.put<JobOffer>(`${this.apiUrl}/${id}`, request);
  }

  close(id: number): Observable<JobOffer> {
    return this.http.patch<JobOffer>(`${this.apiUrl}/${id}/close`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}