import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JobOfferService } from '../../services/job-offer';
import { JobOffer } from '../../models/job-offer.model';

@Component({
  selector: 'app-my-job-offers',
  imports: [CommonModule],
  templateUrl: './my-job-offers.html',
  styleUrl: './my-job-offers.css'
})
export class MyJobOffers implements OnInit {
  jobOffers = signal<JobOffer[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  closingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);

  jobTypeLabels: Record<string, string> = {
    FULL_TIME: 'Temps plein',
    PART_TIME: 'Temps partiel',
    INTERNSHIP: 'Stage',
    FREELANCE: 'Freelance'
  };

  statusLabels: Record<string, string> = {
    OPEN: 'Ouverte',
    CLOSED: 'Fermée',
    DRAFT: 'Brouillon'
  };

  statusBadgeClass: Record<string, string> = {
    OPEN: 'badge-success',
    CLOSED: 'badge-danger',
    DRAFT: 'badge-neutral'
  };

  constructor(private jobOfferService: JobOfferService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobOffers();
  }

  loadJobOffers(): void {
    this.isLoading.set(true);
    this.jobOfferService.getMyJobOffers().subscribe({
      next: (offers) => {
        this.jobOffers.set(offers);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement offres', err);
        this.errorMessage.set('Impossible de charger vos offres');
        this.isLoading.set(false);
      }
    });
  }

  createOffer(): void {
    this.router.navigate(['/my-job-offers/new']);
  }

  editOffer(id: number): void {
    this.router.navigate(['/my-job-offers', id, 'edit']);
  }

  viewApplications(id: number): void {
    this.router.navigate(['/my-job-offers', id, 'applications']);
  }

  closeOffer(id: number): void {
    this.closingId.set(id);
    this.jobOfferService.close(id).subscribe({
      next: (updated) => {
        this.jobOffers.update(offers => offers.map(o => o.id === updated.id ? updated : o));
        this.closingId.set(null);
      },
      error: (err) => {
        console.error('Erreur fermeture offre', err);
        this.closingId.set(null);
      }
    });
  }

  deleteOffer(id: number): void {
    if (!confirm('Supprimer définitivement cette offre ?')) return;

    this.deletingId.set(id);
    this.jobOfferService.delete(id).subscribe({
      next: () => {
        this.jobOffers.update(offers => offers.filter(o => o.id !== id));
        this.deletingId.set(null);
      },
      error: (err) => {
        console.error('Erreur suppression offre', err);
        this.deletingId.set(null);
      }
    });
  }
}