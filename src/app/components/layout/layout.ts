import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  constructor(private authService: AuthService, private router: Router) {}

  get userType(): string | null {
    return this.authService.getUserType();
  }

  get isCandidate(): boolean {
    return this.userType === 'CANDIDATE';
  }

  get isCompany(): boolean {
    return this.userType === 'COMPANY';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}