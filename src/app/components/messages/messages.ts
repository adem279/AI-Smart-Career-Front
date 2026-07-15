import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message';
import { AuthService } from '../../services/auth';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-messages',
  imports: [CommonModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  conversations = signal<Conversation[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  get isCompany(): boolean {
    return this.authService.getUserType() === 'COMPANY';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.messageService.getMyConversations().subscribe({
      next: (list) => {
        this.conversations.set(list);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement conversations', err);
        this.errorMessage.set('Impossible de charger vos conversations');
        this.isLoading.set(false);
      }
    });
  }

  displayName(conv: Conversation): string {
    return this.isCompany ? conv.candidateName : conv.companyName;
  }

  openChat(applicationId: number): void {
    this.router.navigate(['/messages', applicationId]);
  }
}