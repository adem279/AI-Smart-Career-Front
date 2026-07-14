import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Review, ReviewRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  create(request: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, request);
  }

  getMyReviewsWritten(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/me`);
  }

  getReviewsForCandidate(candidateId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/candidate/${candidateId}`);
  }
}