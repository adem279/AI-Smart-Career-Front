import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

type AccountType = 'CANDIDATE' | 'COMPANY';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  accountType: AccountType = 'CANDIDATE';
  errorMessage = '';
  isLoading = false;

  // Champs communs
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  phone = '';

  // Champs entreprise
  companyName = '';
  sector = '';

  constructor(private authService: AuthService, private router: Router) {}

  setAccountType(type: AccountType): void {
    this.accountType = type;
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    const request$ = this.accountType === 'CANDIDATE'
      ? this.authService.registerCandidate({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          phone: this.phone
        })
      : this.authService.registerCompany({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          phone: this.phone,
          companyName: this.companyName,
          sector: this.sector
        });

    request$.subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Inscription réussie', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur d\'inscription', err);
        this.errorMessage = err.error?.message || 'Cet email est peut-être déjà utilisé';
      }
    });
  }
}