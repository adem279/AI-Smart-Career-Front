import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidateService } from '../../services/candidate';
import { Candidate } from '../../models/candidate.model';

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

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.loadProfile();
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
}