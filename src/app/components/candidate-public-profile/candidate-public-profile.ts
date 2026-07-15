import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService } from '../../services/candidate';
import { EducationService } from '../../services/education';
import { ExperienceService } from '../../services/experience';
import { PortfolioService } from '../../services/portfolio';
import { CandidateSkillService } from '../../services/candidate-skill';
import { Candidate } from '../../models/candidate.model';
import { Education } from '../../models/education.model';
import { Experience } from '../../models/experience.model';
import { Portfolio } from '../../models/portfolio.model';
import { CandidateSkill } from '../../models/candidate-skill.model';

@Component({
  selector: 'app-candidate-public-profile',
  imports: [CommonModule],
  templateUrl: './candidate-public-profile.html',
  styleUrl: './candidate-public-profile.css'
})
export class CandidatePublicProfile implements OnInit {
  candidate = signal<Candidate | null>(null);
  educations = signal<Education[]>([]);
  experiences = signal<Experience[]>([]);
  portfolios = signal<Portfolio[]>([]);
  skills = signal<CandidateSkill[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService,
    private educationService: EducationService,
    private experienceService: ExperienceService,
    private portfolioService: PortfolioService,
    private candidateSkillService: CandidateSkillService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll(id);
  }

  loadAll(id: number): void {
    this.isLoading.set(true);

    this.candidateService.getById(id).subscribe({
      next: (candidate) => {
        this.candidate.set(candidate);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement candidat', err);
        this.errorMessage.set('Candidat introuvable');
        this.isLoading.set(false);
      }
    });

    this.educationService.getByCandidateId(id).subscribe({
      next: (list) => this.educations.set(list),
      error: (err) => console.error('Erreur chargement formations', err)
    });

    this.experienceService.getByCandidateId(id).subscribe({
      next: (list) => this.experiences.set(list),
      error: (err) => console.error('Erreur chargement expériences', err)
    });

    this.portfolioService.getByCandidateId(id).subscribe({
      next: (list) => this.portfolios.set(list),
      error: (err) => console.error('Erreur chargement projets', err)
    });

    this.candidateSkillService.getByCandidateId(id).subscribe({
      next: (list) => this.skills.set(list),
      error: (err) => console.error('Erreur chargement compétences', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/my-job-offers']);
  }
}