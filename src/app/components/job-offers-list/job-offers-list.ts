import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobOfferService } from '../../services/job-offer';
import { CandidateSkillService } from '../../services/candidate-skill';
import { ApplicationService } from '../../services/application';
import { AuthService } from '../../services/auth';
import { JobOffer } from '../../models/job-offer.model';
import { CandidateSkill } from '../../models/candidate-skill.model';
import { computeMatchScore, getMatchLabel, getMatchClass } from '../../utils/matching.util';

@Component({
  selector: 'app-job-offers-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-offers-list.html',
  styleUrl: './job-offers-list.css'
})
export class JobOffersList implements OnInit {
  jobOffers = signal<JobOffer[]>([]);
  candidateSkills = signal<CandidateSkill[]>([]);
  appliedOfferIds = signal<Set<number>>(new Set());
  isLoading = signal(true);
  errorMessage = signal('');

  searchText = signal('');
  filterLocation = signal('');
  filterJobType = signal('');
  filterExperienceLevel = signal('');
  filterMinSalary = signal<number | null>(null);
  sortByMatch = signal(false);

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

  getMatchLabel = getMatchLabel;
  getMatchClass = getMatchClass;

  availableLocations = computed(() => {
    const locations = this.jobOffers().map(o => o.location);
    return Array.from(new Set(locations)).sort();
  });

  isCandidate = computed(() => this.authService.getUserType() === 'CANDIDATE');

  filteredOffers = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    const location = this.filterLocation();
    const jobType = this.filterJobType();
    const experienceLevel = this.filterExperienceLevel();
    const minSalary = this.filterMinSalary();
    const skills = this.candidateSkills();

    let result = this.jobOffers().filter(offer => {
      const matchesSearch = !search ||
        offer.title.toLowerCase().includes(search) ||
        offer.description.toLowerCase().includes(search) ||
        offer.companyName.toLowerCase().includes(search);

      const matchesLocation = !location || offer.location === location;
      const matchesJobType = !jobType || offer.jobType === jobType;
      const matchesExperience = !experienceLevel || offer.experienceLevel === experienceLevel;
      const matchesSalary = !minSalary || (offer.salary !== null && offer.salary >= minSalary);

      return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesSalary;
    });

    if (this.sortByMatch() && this.isCandidate()) {
      result = [...result].sort((a, b) =>
        computeMatchScore(b, skills) - computeMatchScore(a, skills)
      );
    }

    return result;
  });

  constructor(
    private jobOfferService: JobOfferService,
    private candidateSkillService: CandidateSkillService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobOffers();
    if (this.isCandidate()) {
      this.loadCandidateSkills();
      this.loadMyApplications();
    }
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

  loadCandidateSkills(): void {
    this.candidateSkillService.getMySkills().subscribe({
      next: (skills) => this.candidateSkills.set(skills),
      error: (err) => console.error('Erreur chargement compétences', err)
    });
  }

  loadMyApplications(): void {
    this.applicationService.getMyApplications().subscribe({
      next: (applications) => {
        this.appliedOfferIds.set(new Set(applications.map(a => a.jobOfferId)));
      },
      error: (err) => console.error('Erreur chargement candidatures', err)
    });
  }

  hasApplied(offerId: number): boolean {
    return this.appliedOfferIds().has(offerId);
  }

  getMatchScore(offer: JobOffer): number {
    return computeMatchScore(offer, this.candidateSkills());
  }

  resetFilters(): void {
    this.searchText.set('');
    this.filterLocation.set('');
    this.filterJobType.set('');
    this.filterExperienceLevel.set('');
    this.filterMinSalary.set(null);
  }

  viewOffer(id: number): void {
    this.router.navigate(['/job-offers', id]);
  }
}