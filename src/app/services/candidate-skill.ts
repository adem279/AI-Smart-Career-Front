import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CandidateSkill } from '../models/candidate-skill.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateSkillService {
  private apiUrl = `${environment.apiUrl}/candidate-skills`;

  constructor(private http: HttpClient) {}

  getMySkills(): Observable<CandidateSkill[]> {
    return this.http.get<CandidateSkill[]>(`${this.apiUrl}/me`);
  }
}