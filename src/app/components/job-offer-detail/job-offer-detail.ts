import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferService } from '../../services/job-offer';
import { ApplicationService } from '../../services/application';
import { ResumeService } from '../../services/resume';
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
  selectedFile: File | null = null;
  selectedFileName = signal('');

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
    private applicationService: ApplicationService,
    private resumeService: ResumeService
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'application/pdf' &&
          file.type !== 'application/msword' &&
          file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.applyError.set('Seuls les fichiers PDF ou Word sont acceptés');
        this.selectedFile = null;
        this.selectedFileName.set('');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName.set(file.name);
      this.applyError.set('');
    }
  }

  onApply(): void {
    const offer = this.jobOffer();
    if (!offer) return;

    if (!this.selectedFile) {
      this.applyError.set('Veuillez joindre votre CV pour postuler');
      return;
    }

    this.isApplying.set(true);
    this.applyError.set('');

    // Étape 1 : upload du CV
    this.resumeService.upload(this.selectedFile).subscribe({
      next: (resume) => {
        // Étape 2 : créer la candidature avec le resumeId obtenu
        this.applicationService.apply({
          jobOfferId: offer.id,
          message: this.message,
          resumeId: resume.id
        }).subscribe({
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
      },
      error: (err) => {
        this.isApplying.set(false);
        console.error('Erreur upload CV', err);
        this.applyError.set('Erreur lors de l\'upload du CV');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/job-offers']);
  }
}