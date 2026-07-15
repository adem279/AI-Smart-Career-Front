import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application';
import { InterviewService } from '../../services/interview';
import { Application } from '../../models/application.model';
import { Interview } from '../../models/interview.model';
import { isInterviewPast } from '../../utils/interview.util';

@Component({
  selector: 'app-my-applications',
  imports: [CommonModule],
  templateUrl: './my-applications.html',
  styleUrl: './my-applications.css'
})
export class MyApplications implements OnInit {
  applications = signal<Application[]>([]);
  interviews = signal<Record<number, Interview | null>>({});
  isLoading = signal(true);
  errorMessage = signal('');
  withdrawingId = signal<number | null>(null);

  statusLabels: Record<string, string> = {
    PENDING: 'En attente',
    ACCEPTED: 'Acceptée',
    REJECTED: 'Refusée'
  };

  statusBadgeClass: Record<string, string> = {
    PENDING: 'badge-neutral',
    ACCEPTED: 'badge-success',
    REJECTED: 'badge-danger'
  };

  isInterviewPast = isInterviewPast;

  constructor(
    private applicationService: ApplicationService,
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading.set(true);
    this.applicationService.getMyApplications().subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.isLoading.set(false);
        this.loadInterviewsForAccepted(apps);
      },
      error: (err) => {
        console.error('Erreur chargement candidatures', err);
        this.errorMessage.set('Impossible de charger vos candidatures');
        this.isLoading.set(false);
      }
    });
  }

  loadInterviewsForAccepted(apps: Application[]): void {
    const accepted = apps.filter(a => a.status === 'ACCEPTED');
    accepted.forEach(app => {
      this.interviewService.getByApplicationId(app.id).subscribe({
        next: (interview) => {
          this.interviews.update(map => ({ ...map, [app.id]: interview }));
        },
        error: () => {
          this.interviews.update(map => ({ ...map, [app.id]: null }));
        }
      });
    });
  }

  withdraw(id: number): void {
    this.withdrawingId.set(id);
    this.applicationService.withdraw(id).subscribe({
      next: () => {
        this.applications.update(apps => apps.filter(a => a.id !== id));
        this.withdrawingId.set(null);
      },
      error: (err) => {
        console.error('Erreur retrait candidature', err);
        this.withdrawingId.set(null);
      }
    });
  }
}