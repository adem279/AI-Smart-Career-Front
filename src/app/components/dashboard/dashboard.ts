import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/application';
import { AuthService } from '../../services/auth';
import { Application } from '../../models/application.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  applications = signal<Application[]>([]);
  isLoading = signal(true);

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  get pendingCount(): number {
    return this.applications().filter(a => a.status === 'PENDING').length;
  }

  get acceptedCount(): number {
    return this.applications().filter(a => a.status === 'ACCEPTED').length;
  }

  get rejectedCount(): number {
    return this.applications().filter(a => a.status === 'REJECTED').length;
  }

  ngOnInit(): void {
    this.applicationService.getMyApplications().subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}