import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Resume {
  id: number;
  fileName: string;
  filePath: string;
  uploadDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = `${environment.apiUrl}/resumes`;

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<Resume> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Resume>(this.apiUrl, formData);
  }

  getMyResumes(): Observable<Resume[]> {
    return this.http.get<Resume[]>(`${this.apiUrl}/me`);
  }
}