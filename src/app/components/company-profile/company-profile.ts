import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css'
})
export class CompanyProfile implements OnInit {
  company = signal<Company | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);
  isEditing = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  firstName = '';
  lastName = '';
  phone = '';
  companyName = '';
  sector = '';
  address = '';
  website = '';
  description = '';

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.companyService.getMyProfile().subscribe({
      next: (company) => {
        this.company.set(company);
        this.fillForm(company);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement profil', err);
        this.errorMessage.set('Impossible de charger votre profil');
        this.isLoading.set(false);
      }
    });
  }

  fillForm(company: Company): void {
    this.firstName = company.firstName;
    this.lastName = company.lastName;
    this.phone = company.phone || '';
    this.companyName = company.companyName;
    this.sector = company.sector || '';
    this.address = company.address || '';
    this.website = company.website || '';
    this.description = company.description || '';
  }

  startEditing(): void {
    this.isEditing.set(true);
    this.successMessage.set('');
  }

  cancelEditing(): void {
    const current = this.company();
    if (current) this.fillForm(current);
    this.isEditing.set(false);
  }

  onSave(): void {
    this.isSaving.set(true);
    this.errorMessage.set('');

    this.companyService.updateMyProfile({
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      companyName: this.companyName,
      sector: this.sector,
      address: this.address,
      website: this.website,
      description: this.description
    }).subscribe({
      next: (updated) => {
        this.company.set(updated);
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