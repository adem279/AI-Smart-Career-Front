import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JobOfferService } from '../../services/job-offer';
import { JobOffer } from '../../models/job-offer.model';

@Component({
  selector: 'app-job-offers-list',
  imports: [CommonModule],
  templateUrl: './job-offers-list.html',
  styleUrl: './job-offers-list.css'
})
export class JobOffersList implements OnInit {
  jobOffers = signal<JobOffer[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  jobTypeLabels: Record<string, string> = {
    FULL_TIME: 'Temps plein',
    PART_TIME: 'Temps partiel',
    INTERNSHIP: 'Stage',
    FREELANCE: 'Freelance'
  };

  experienceLabels: Record<string, string> = {
    JUNIOR: 'Junior',
    MID_LEVEL: 'Intermédiaire',
    SENIOR: 'Senior'
  };

  constructor(private jobOfferService: JobOfferService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobOffers();
  }

  loadJobOffers(): void {
    this.isLoading.set(true);
    this.jobOfferService.getAllOpen().subscribe({
      next: (offers) => {
        this.jobOffers.set(offers);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement offres', err);
        this.errorMessage.set('Impossible de charger les offres pour le moment');
        this.isLoading.set(false);
      }
    });
  }

  viewOffer(id: number): void {
    this.router.navigate(['/job-offers', id]);
  }
}