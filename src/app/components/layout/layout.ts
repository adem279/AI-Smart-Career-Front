import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MessageService } from '../../services/message';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit, OnDestroy {
  unreadCount = signal(0);
  private pollHandle: any;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  get userType(): string | null {
    return this.authService.getUserType();
  }

  get isCandidate(): boolean {
    return this.userType === 'CANDIDATE';
  }

  get isCompany(): boolean {
    return this.userType === 'COMPANY';
  }

  ngOnInit(): void {
    this.loadUnreadCount();
    this.pollHandle = setInterval(() => this.loadUnreadCount(), 15000);
  }

  ngOnDestroy(): void {
    if (this.pollHandle) clearInterval(this.pollHandle);
  }

  loadUnreadCount(): void {
    this.messageService.getUnreadCount().subscribe({
      next: (count) => this.unreadCount.set(count),
      error: () => {}
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}