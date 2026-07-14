import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferService } from '../../services/job-offer';
import { ApplicationService } from '../../services/application';
import { JobOffer } from '../../models/job-offer.model';

@Component({
  selector: 'app-job-offer-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-offer-detail.html',
  styleUrl: './job-offer-detail.css'
})
export class JobOfferDetail implements OnInit {
  jobOffer = signal<JobOffer | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  message = '';
  isApplying = signal(false);
  applySuccess = signal(false);
  applyError = signal('');

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobOfferService: JobOfferService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadJobOffer(id);
  }

  loadJobOffer(id: number): void {
    this.isLoading.set(true);
    this.jobOfferService.getById(id).subscribe({
      next: (offer) => {
        this.jobOffer.set(offer);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement offre', err);
        this.errorMessage.set('Offre introuvable');
        this.isLoading.set(false);
      }
    });
  }

  onApply(): void {
    const offer = this.jobOffer();
    if (!offer) return;

    this.isApplying.set(true);
    this.applyError.set('');

    this.applicationService.apply({ jobOfferId: offer.id, message: this.message }).subscribe({
      next: () => {
        this.isApplying.set(false);
        this.applySuccess.set(true);
      },
      error: (err) => {
        this.isApplying.set(false);
        console.error('Erreur candidature', err);
        this.applyError.set(err.error?.message || 'Vous avez peut-être déjà postulé à cette offre');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/job-offers']);
  }
}