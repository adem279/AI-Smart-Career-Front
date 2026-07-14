import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/application';
import { JobOfferService } from '../../services/job-offer';
import { AuthService } from '../../services/auth';
import { Application } from '../../models/application.model';
import { JobOffer } from '../../models/job-offer.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  applications = signal<Application[]>([]);
  jobOffers = signal<JobOffer[]>([]);
  isLoading = signal(true);

  constructor(
    private applicationService: ApplicationService,
    private jobOfferService: JobOfferService,
    private authService: AuthService
  ) {}

  get isCandidate(): boolean {
    return this.authService.getUserType() === 'CANDIDATE';
  }

  get isCompany(): boolean {
    return this.authService.getUserType() === 'COMPANY';
  }

  // ===== Stats Candidat =====
  get pendingCount(): number {
    return this.applications().filter(a => a.status === 'PENDING').length;
  }

  get acceptedCount(): number {
    return this.applications().filter(a => a.status === 'ACCEPTED').length;
  }

  get rejectedCount(): number {
    return this.applications().filter(a => a.status === 'REJECTED').length;
  }

  // ===== Stats Entreprise =====
  get openOffersCount(): number {
    return this.jobOffers().filter(o => o.status === 'OPEN').length;
  }

  get closedOffersCount(): number {
    return this.jobOffers().filter(o => o.status === 'CLOSED').length;
  }

  ngOnInit(): void {
    if (this.isCandidate) {
      this.applicationService.getMyApplications().subscribe({
        next: (apps) => {
          this.applications.set(apps);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }

    if (this.isCompany) {
      this.jobOfferService.getMyJobOffers().subscribe({
        next: (offers) => {
          this.jobOffers.set(offers);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }
}