import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  candidate = signal<Candidate | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);
  isEditing = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  firstName = '';
  lastName = '';
  phone = '';
  address = '';
  birthDate = '';
  bio = '';

  // Sections
  educations = signal<Education[]>([]);
  experiences = signal<Experience[]>([]);
  portfolios = signal<Portfolio[]>([]);
  skills = signal<CandidateSkill[]>([]);

  showEducationForm = signal(false);
  eduUniversity = '';
  eduDegree = '';
  eduStartDate = '';
  eduEndDate = '';

  showExperienceForm = signal(false);
  expCompany = '';
  expPosition = '';
  expStartDate = '';
  expEndDate = '';
  expDescription = '';

  showPortfolioForm = signal(false);
  portTitle = '';
  portDescription = '';
  portProjectUrl = '';
  portGithubUrl = '';

  constructor(
    private candidateService: CandidateService,
    private educationService: EducationService,
    private experienceService: ExperienceService,
    private portfolioService: PortfolioService,
    private candidateSkillService: CandidateSkillService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadEducations();
    this.loadExperiences();
    this.loadPortfolios();
    this.loadSkills();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.candidateService.getMyProfile().subscribe({
      next: (candidate) => {
        this.candidate.set(candidate);
        this.fillForm(candidate);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement profil', err);
        this.errorMessage.set('Impossible de charger votre profil');
        this.isLoading.set(false);
      }
    });
  }

  fillForm(candidate: Candidate): void {
    this.firstName = candidate.firstName;
    this.lastName = candidate.lastName;
    this.phone = candidate.phone || '';
    this.address = candidate.address || '';
    this.birthDate = candidate.birthDate || '';
    this.bio = candidate.bio || '';
  }

  startEditing(): void {
    this.isEditing.set(true);
    this.successMessage.set('');
  }

  cancelEditing(): void {
    const current = this.candidate();
    if (current) this.fillForm(current);
    this.isEditing.set(false);
  }

  onSave(): void {
    this.isSaving.set(true);
    this.errorMessage.set('');

    this.candidateService.updateMyProfile({
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      address: this.address,
      birthDate: this.birthDate,
      bio: this.bio
    }).subscribe({
      next: (updated) => {
        this.candidate.set(updated);
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.successMessage.set('Profil mis à jour avec succès');
      },
      error: (err) => {
        console.error('Erreur mise à jour profil', err);
        this.errorMessage.set('Erreur lors de la mise à jour');
        this.isSaving.set(false);
      }
    });
  }

  // ===== EDUCATION =====
  loadEducations(): void {
    this.educationService.getMyEducations().subscribe({
      next: (list) => this.educations.set(list),
      error: (err) => console.error('Erreur chargement formations', err)
    });
  }

  addEducation(): void {
    this.educationService.create({
      university: this.eduUniversity,
      degree: this.eduDegree,
      startDate: this.eduStartDate,
      endDate: this.eduEndDate
    }).subscribe({
      next: (edu) => {
        this.educations.update(list => [...list, edu]);
        this.eduUniversity = '';
        this.eduDegree = '';
        this.eduStartDate = '';
        this.eduEndDate = '';
        this.showEducationForm.set(false);
      },
      error: (err) => console.error('Erreur ajout formation', err)
    });
  }

  deleteEducation(id: number): void {
    this.educationService.delete(id).subscribe({
      next: () => this.educations.update(list => list.filter(e => e.id !== id)),
      error: (err) => console.error('Erreur suppression formation', err)
    });
  }

  // ===== EXPERIENCE =====
  loadExperiences(): void {
    this.experienceService.getMyExperiences().subscribe({
      next: (list) => this.experiences.set(list),
      error: (err) => console.error('Erreur chargement expériences', err)
    });
  }

  addExperience(): void {
    this.experienceService.create({
      company: this.expCompany,
      position: this.expPosition,
      startDate: this.expStartDate,
      endDate: this.expEndDate,
      description: this.expDescription
    }).subscribe({
      next: (exp) => {
        this.experiences.update(list => [...list, exp]);
        this.expCompany = '';
        this.expPosition = '';
        this.expStartDate = '';
        this.expEndDate = '';
        this.expDescription = '';
        this.showExperienceForm.set(false);
      },
      error: (err) => console.error('Erreur ajout expérience', err)
    });
  }

  deleteExperience(id: number): void {
    this.experienceService.delete(id).subscribe({
      next: () => this.experiences.update(list => list.filter(e => e.id !== id)),
      error: (err) => console.error('Erreur suppression expérience', err)
    });
  }

  // ===== PORTFOLIO =====
  loadPortfolios(): void {
    this.portfolioService.getMyPortfolios().subscribe({
      next: (list) => this.portfolios.set(list),
      error: (err) => console.error('Erreur chargement projets', err)
    });
  }

  addPortfolio(): void {
    this.portfolioService.create({
      title: this.portTitle,
      description: this.portDescription,
      projectUrl: this.portProjectUrl,
      githubUrl: this.portGithubUrl
    }).subscribe({
      next: (port) => {
        this.portfolios.update(list => [...list, port]);
        this.portTitle = '';
        this.portDescription = '';
        this.portProjectUrl = '';
        this.portGithubUrl = '';
        this.showPortfolioForm.set(false);
      },
      error: (err) => console.error('Erreur ajout projet', err)
    });
  }

  deletePortfolio(id: number): void {
    this.portfolioService.delete(id).subscribe({
      next: () => this.portfolios.update(list => list.filter(p => p.id !== id)),
      error: (err) => console.error('Erreur suppression projet', err)
    });
  }

  // ===== SKILLS =====
  loadSkills(): void {
    this.candidateSkillService.getMySkills().subscribe({
      next: (list) => this.skills.set(list),
      error: (err) => console.error('Erreur chargement compétences', err)
    });
  }
}