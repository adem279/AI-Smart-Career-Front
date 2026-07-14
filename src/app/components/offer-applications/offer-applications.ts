import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../services/application';
import { JobOfferService } from '../../services/job-offer';
import { Application } from '../../models/application.model';
import { JobOffer } from '../../models/job-offer.model';

@Component({
  selector: 'app-offer-applications',
  imports: [CommonModule],
  templateUrl: './offer-applications.html',
  styleUrl: './offer-applications.css'
})
export class OfferApplications implements OnInit {
  jobOffer = signal<JobOffer | null>(null);
  applications = signal<Application[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  processingId = signal<number | null>(null);

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

  private offerId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private jobOfferService: JobOfferService
  ) {}

  ngOnInit(): void {
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOffer();
    this.loadApplications();
  }

  loadOffer(): void {
    this.jobOfferService.getById(this.offerId).subscribe({
      next: (offer) => this.jobOffer.set(offer),
      error: (err) => console.error('Erreur chargement offre', err)
    });
  }

  loadApplications(): void {
    this.isLoading.set(true);
    this.applicationService.getApplicationsForJobOffer(this.offerId).subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement candidatures', err);
        this.errorMessage.set('Impossible de charger les candidatures');
        this.isLoading.set(false);
      }
    });
  }

  accept(id: number): void {
    this.processingId.set(id);
    this.applicationService.accept(id).subscribe({
      next: (updated) => {
        this.applications.update(apps => apps.map(a => a.id === updated.id ? updated : a));
        this.processingId.set(null);
      },
      error: (err) => {
        console.error('Erreur acceptation', err);
        this.processingId.set(null);
      }
    });
  }

  reject(id: number): void {
    this.processingId.set(id);
    this.applicationService.reject(id).subscribe({
      next: (updated) => {
        this.applications.update(apps => apps.map(a => a.id === updated.id ? updated : a));
        this.processingId.set(null);
      },
      error: (err) => {
        console.error('Erreur refus', err);
        this.processingId.set(null);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/my-job-offers']);
  }
}