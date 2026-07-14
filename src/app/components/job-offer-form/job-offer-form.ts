import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferService } from '../../services/job-offer';
import { JobType, ExperienceLevel } from '../../models/job-offer.model';

@Component({
  selector: 'app-job-offer-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-offer-form.html',
  styleUrl: './job-offer-form.css'
})
export class JobOfferForm implements OnInit {
  isEditMode = signal(false);
  offerId: number | null = null;
  isSaving = signal(false);
  errorMessage = signal('');

  title = '';
  description = '';
  salary: number | null = null;
  location = '';
  jobType: JobType = 'FULL_TIME';
  experienceLevel: ExperienceLevel = 'JUNIOR';
  deadline = '';

  jobTypeOptions: JobType[] = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'FREELANCE'];
  experienceLevelOptions: ExperienceLevel[] = ['JUNIOR', 'MID_LEVEL', 'SENIOR'];

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
    private jobOfferService: JobOfferService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.offerId = Number(idParam);
      this.loadOffer(this.offerId);
    }
  }

  loadOffer(id: number): void {
    this.jobOfferService.getById(id).subscribe({
      next: (offer) => {
        this.title = offer.title;
        this.description = offer.description;
        this.salary = offer.salary;
        this.location = offer.location;
        this.jobType = offer.jobType;
        this.experienceLevel = offer.experienceLevel;
        this.deadline = offer.deadline;
      },
      error: (err) => {
        console.error('Erreur chargement offre', err);
        this.errorMessage.set('Impossible de charger cette offre');
      }
    });
  }

  onSubmit(): void {
    this.isSaving.set(true);
    this.errorMessage.set('');

    const request = {
      title: this.title,
      description: this.description,
      salary: this.salary,
      location: this.location,
      jobType: this.jobType,
      experienceLevel: this.experienceLevel,
      deadline: this.deadline
    };

    const request$ = this.isEditMode() && this.offerId
      ? this.jobOfferService.update(this.offerId, request)
      : this.jobOfferService.create(request);

    request$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/my-job-offers']);
      },
      error: (err) => {
        console.error('Erreur sauvegarde offre', err);
        this.errorMessage.set('Erreur lors de l\'enregistrement');
        this.isSaving.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/my-job-offers']);
  }
}