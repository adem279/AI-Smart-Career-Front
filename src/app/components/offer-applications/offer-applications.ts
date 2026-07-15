import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../services/application';
import { JobOfferService } from '../../services/job-offer';
import { InterviewService } from '../../services/interview';
import { ReviewService } from '../../services/review';
import { Application } from '../../models/application.model';
import { JobOffer } from '../../models/job-offer.model';
import { Interview, InterviewRequest } from '../../models/interview.model';
import { Review } from '../../models/review.model';
import { isInterviewPast } from '../../utils/interview.util';

@Component({
  selector: 'app-offer-applications',
  imports: [CommonModule, FormsModule],
  templateUrl: './offer-applications.html',
  styleUrl: './offer-applications.css'
})
export class OfferApplications implements OnInit {
  jobOffer = signal<JobOffer | null>(null);
  applications = signal<Application[]>([]);
  interviews = signal<Record<number, Interview | null>>({});
  reviewsByCandidate = signal<Record<number, Review | null>>({});
  isLoading = signal(true);
  errorMessage = signal('');
  processingId = signal<number | null>(null);

  schedulingForAppId = signal<number | null>(null);
  interviewDate = '';
  interviewTime = '';
  interviewLocation = '';
  interviewType = 'Présentiel';
  interviewMeetingLink = '';

  reviewingForCandidateId = signal<number | null>(null);
  reviewRating = 5;
  reviewComment = '';

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

  ratingOptions = [1, 2, 3, 4, 5];

  isInterviewPast = isInterviewPast;

  private offerId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private jobOfferService: JobOfferService,
    private interviewService: InterviewService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOffer();
    this.loadApplications();
    this.loadMyReviews();
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
        this.loadInterviewsForAccepted(apps);
      },
      error: (err) => {
        console.error('Erreur chargement candidatures', err);
        this.errorMessage.set('Impossible de charger les candidatures');
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

  loadMyReviews(): void {
    this.reviewService.getMyReviewsWritten().subscribe({
      next: (reviews) => {
        const map: Record<number, Review> = {};
        reviews.forEach(r => map[r.candidateId] = r);
        this.reviewsByCandidate.set(map);
      },
      error: (err) => console.error('Erreur chargement avis', err)
    });
  }

  accept(id: number): void {
    this.processingId.set(id);
    this.applicationService.accept(id).subscribe({
      next: (updated) => {
        this.applications.update(apps => apps.map(a => a.id === updated.id ? updated : a));
        this.interviews.update(map => ({ ...map, [updated.id]: null }));
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

  openScheduleForm(applicationId: number): void {
    this.schedulingForAppId.set(applicationId);
    this.interviewDate = '';
    this.interviewTime = '';
    this.interviewLocation = '';
    this.interviewType = 'Présentiel';
    this.interviewMeetingLink = '';
  }

  cancelScheduleForm(): void {
    this.schedulingForAppId.set(null);
  }

  confirmSchedule(applicationId: number): void {
    const request: InterviewRequest = {
      date: this.interviewDate,
      time: this.interviewTime,
      location: this.interviewLocation,
      type: this.interviewType,
      meetingLink: this.interviewMeetingLink || undefined
    };

    this.interviewService.schedule(applicationId, request).subscribe({
      next: (interview) => {
        this.interviews.update(map => ({ ...map, [applicationId]: interview }));
        this.schedulingForAppId.set(null);
      },
      error: (err) => console.error('Erreur planification entretien', err)
    });
  }

  setResult(applicationId: number, interviewId: number, result: string): void {
    this.interviewService.setResult(interviewId, result).subscribe({
      next: (updated) => {
        this.interviews.update(map => ({ ...map, [applicationId]: updated }));
      },
      error: (err) => console.error('Erreur mise à jour résultat', err)
    });
  }

  cancelInterview(applicationId: number, interviewId: number): void {
    this.interviewService.cancel(interviewId).subscribe({
      next: () => {
        this.interviews.update(map => ({ ...map, [applicationId]: null }));
      },
      error: (err) => console.error('Erreur annulation entretien', err)
    });
  }

  openReviewForm(candidateId: number): void {
    this.reviewingForCandidateId.set(candidateId);
    this.reviewRating = 5;
    this.reviewComment = '';
  }

  cancelReviewForm(): void {
    this.reviewingForCandidateId.set(null);
  }

  confirmReview(candidateId: number): void {
    this.reviewService.create({
      candidateId,
      rating: this.reviewRating,
      comment: this.reviewComment
    }).subscribe({
      next: (review) => {
        this.reviewsByCandidate.update(map => ({ ...map, [candidateId]: review }));
        this.reviewingForCandidateId.set(null);
      },
      error: (err) => console.error('Erreur création avis', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/my-job-offers']);
  }
}